/**
 * ============================================
 * AUTH CONTROLLER
 * Handle login dan logout
 * ============================================
 */

const { promisePool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password harus diisi'
            });
        }

        // Cari user berdasarkan username
        const [users] = await promisePool.query(
            `SELECT u.*, l.nama_level, p.id_pelanggan, p.nama_pelanggan
             FROM user u
             INNER JOIN level l ON u.id_level = l.id_level
             LEFT JOIN pelanggan p ON u.id_user = p.id_user
             WHERE u.username = ?`,
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        const user = users[0];

        // Verify password
        // CATATAN: Untuk demo, kita pakai plain text comparison
        // Di production, HARUS pakai bcrypt.compare()
        const isPasswordValid = password === user.password;
        // const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id_user: user.id_user,
                username: user.username,
                nama_lengkap: user.nama_lengkap,
                id_level: user.id_level,
                nama_level: user.nama_level,
                id_pelanggan: user.id_pelanggan || null
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token berlaku 24 jam
        );

        res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                user: {
                    id_user: user.id_user,
                    username: user.username,
                    nama_lengkap: user.nama_lengkap,
                    email: user.email,
                    id_level: user.id_level,
                    nama_level: user.nama_level,
                    id_pelanggan: user.id_pelanggan,
                    nama_pelanggan: user.nama_pelanggan
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat login'
        });
    }
};

/**
 * Logout user (client-side, hapus token)
 * POST /api/auth/logout
 */
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logout berhasil'
    });
};

/**
 * Get current user info
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
    try {
        const [users] = await promisePool.query(
            `SELECT u.id_user, u.username, u.nama_lengkap, u.email, 
                    u.id_level, l.nama_level, p.id_pelanggan, p.nama_pelanggan
             FROM user u
             INNER JOIN level l ON u.id_level = l.id_level
             LEFT JOIN pelanggan p ON u.id_user = p.id_user
             WHERE u.id_user = ?`,
            [req.user.id_user]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan'
        });
    }
};

module.exports = {
    login,
    logout,
    getCurrentUser
};
