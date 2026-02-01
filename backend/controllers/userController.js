/**
 * USER CONTROLLER - CRUD User Management
 */
const { promisePool } = require('../config/database');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT 
                u.id_user,
                u.username,
                u.nama_lengkap,
                u.email,
                u.id_level,
                l.nama_level,
                u.id_pelanggan,
                p.nama_pelanggan
            FROM user u
            LEFT JOIN level l ON u.id_level = l.id_level
            LEFT JOIN pelanggan p ON u.id_pelanggan = p.id_pelanggan
            ORDER BY u.id_user DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
    }
};

// CREATE user
const createUser = async (req, res) => {
    try {
        const { username, password, nama_lengkap, email, id_level, id_pelanggan } = req.body;

        // Check if username already exists
        const [existing] = await promisePool.query('SELECT id_user FROM user WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
        }

        // Insert new user (password should be hashed in production)
        const [result] = await promisePool.query(
            'INSERT INTO user (username, password, nama_lengkap, email, id_level, id_pelanggan) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, nama_lengkap, email, id_level, id_pelanggan || null]
        );

        res.status(201).json({
            success: true,
            message: 'User berhasil ditambahkan',
            data: { id_user: result.insertId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menambah user' });
    }
};

// UPDATE user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, nama_lengkap, email, id_level, id_pelanggan } = req.body;

        // Check if username is taken by another user
        const [existing] = await promisePool.query(
            'SELECT id_user FROM user WHERE username = ? AND id_user != ?',
            [username, id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
        }

        // Update user (only update password if provided)
        let query, params;
        if (password) {
            query = 'UPDATE user SET username=?, password=?, nama_lengkap=?, email=?, id_level=?, id_pelanggan=? WHERE id_user=?';
            params = [username, password, nama_lengkap, email, id_level, id_pelanggan || null, id];
        } else {
            query = 'UPDATE user SET username=?, nama_lengkap=?, email=?, id_level=?, id_pelanggan=? WHERE id_user=?';
            params = [username, nama_lengkap, email, id_level, id_pelanggan || null, id];
        }

        await promisePool.query(query, params);
        res.json({ success: true, message: 'User berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengupdate user' });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting admin user
        const [user] = await promisePool.query('SELECT id_level FROM user WHERE id_user = ?', [id]);
        if (user.length > 0 && user[0].id_level === 1) {
            return res.status(400).json({ success: false, message: 'Tidak dapat menghapus user Admin' });
        }

        await promisePool.query('DELETE FROM user WHERE id_user = ?', [id]);
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus user' });
    }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
