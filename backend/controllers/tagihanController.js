/**
 * TAGIHAN CONTROLLER - Lihat Tagihan
 */
const { promisePool } = require('../config/database');

// GET all tagihan
const getAllTagihan = async (req, res) => {
    try {
        const { id_pelanggan, bulan, tahun, status_bayar } = req.query;
        const user = req.user;

        let query = `
            SELECT t.*, p.nomor_meter, p.nama_pelanggan, p.alamat
            FROM tagihan t
            INNER JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan
            WHERE 1=1
        `;
        const params = [];

        if (user.id_level !== 1) {
            if (!user.id_pelanggan) {
                return res.status(403).json({ success: false, message: 'Akses ditolak.' });
            }
            query += ' AND t.id_pelanggan = ?';
            params.push(user.id_pelanggan);
        } else if (id_pelanggan) {
            query += ' AND t.id_pelanggan = ?';
            params.push(id_pelanggan);
        }
        if (bulan) {
            query += ' AND t.bulan = ?';
            params.push(bulan);
        }
        if (tahun) {
            query += ' AND t.tahun = ?';
            params.push(tahun);
        }
        if (status_bayar) {
            query += ' AND t.status_bayar = ?';
            params.push(status_bayar);
        }

        query += ' ORDER BY t.tahun DESC, t.bulan DESC';

        const [rows] = await promisePool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data tagihan' });
    }
};

// GET tagihan by ID
const getTagihanById = async (req, res) => {
    try {
        const user = req.user;
        const [rows] = await promisePool.query(`
            SELECT t.*, p.nomor_meter, p.nama_pelanggan, p.alamat
            FROM tagihan t
            INNER JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan
            WHERE t.id_tagihan = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tagihan tidak ditemukan' });
        }

        if (user.id_level !== 1 && rows[0].id_pelanggan !== user.id_pelanggan) {
            return res.status(403).json({ success: false, message: 'Akses ditolak.' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data tagihan' });
    }
};

// UPDATE status pembayaran
const bayarTagihan = async (req, res) => {
    try {
        const user = req.user;
        const [rows] = await promisePool.query(
            'SELECT id_pelanggan, status_bayar FROM tagihan WHERE id_tagihan = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tagihan tidak ditemukan' });
        }

        if (user.id_level !== 1 && rows[0].id_pelanggan !== user.id_pelanggan) {
            return res.status(403).json({ success: false, message: 'Akses ditolak.' });
        }

        if (rows[0].status_bayar === 'Sudah Bayar') {
            return res.status(400).json({ success: false, message: 'Tagihan sudah dibayar' });
        }

        await promisePool.query(
            'UPDATE tagihan SET status_bayar = "Sudah Bayar", tanggal_bayar = NOW() WHERE id_tagihan = ?',
            [req.params.id]
        );

        res.json({ success: true, message: 'Tagihan berhasil dibayar' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal membayar tagihan' });
    }
};

module.exports = { getAllTagihan, getTagihanById, bayarTagihan };
