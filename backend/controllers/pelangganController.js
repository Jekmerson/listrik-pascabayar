/**
 * PELANGGAN CONTROLLER - CRUD Pelanggan (Admin only)
 */
const { promisePool } = require('../config/database');

// GET all pelanggan
const getAllPelanggan = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT p.*, t.daya, t.tarif_per_kwh, u.username
            FROM pelanggan p
            INNER JOIN tarif t ON p.id_tarif = t.id_tarif
            LEFT JOIN user u ON p.id_user = u.id_user
            ORDER BY p.nama_pelanggan
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pelanggan' });
    }
};

// GET pelanggan by ID
const getPelangganById = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT p.*, t.daya, t.tarif_per_kwh, t.biaya_beban, u.username, u.email
            FROM pelanggan p
            INNER JOIN tarif t ON p.id_tarif = t.id_tarif
            LEFT JOIN user u ON p.id_user = u.id_user
            WHERE p.id_pelanggan = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pelanggan tidak ditemukan' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pelanggan' });
    }
};

// CREATE pelanggan
const createPelanggan = async (req, res) => {
    try {
        const { nomor_meter, nama_pelanggan, alamat, id_tarif } = req.body;

        const [result] = await promisePool.query(
            'INSERT INTO pelanggan (nomor_meter, nama_pelanggan, alamat, id_tarif) VALUES (?, ?, ?, ?)',
            [nomor_meter, nama_pelanggan, alamat, id_tarif]
        );

        res.status(201).json({
            success: true,
            message: 'Pelanggan berhasil ditambahkan',
            data: { id_pelanggan: result.insertId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menambah pelanggan' });
    }
};

// UPDATE pelanggan
const updatePelanggan = async (req, res) => {
    try {
        const { nomor_meter, nama_pelanggan, alamat, id_tarif } = req.body;

        await promisePool.query(
            'UPDATE pelanggan SET nomor_meter=?, nama_pelanggan=?, alamat=?, id_tarif=? WHERE id_pelanggan=?',
            [nomor_meter, nama_pelanggan, alamat, id_tarif, req.params.id]
        );

        res.json({ success: true, message: 'Pelanggan berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengupdate pelanggan' });
    }
};

// DELETE pelanggan
const deletePelanggan = async (req, res) => {
    try {
        await promisePool.query('DELETE FROM pelanggan WHERE id_pelanggan = ?', [req.params.id]);
        res.json({ success: true, message: 'Pelanggan berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus pelanggan' });
    }
};

module.exports = { getAllPelanggan, getPelangganById, createPelanggan, updatePelanggan, deletePelanggan };
