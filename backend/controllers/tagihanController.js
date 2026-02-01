/**
 * TAGIHAN CONTROLLER - Lihat Tagihan
 */
const { promisePool } = require('../config/database');

// GET all tagihan
const getAllTagihan = async (req, res) => {
    try {
        const { id_pelanggan, bulan, tahun, status_bayar } = req.query;

        let query = `
            SELECT t.*, p.nomor_meter, p.nama_pelanggan, p.alamat
            FROM tagihan t
            INNER JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan
            WHERE 1=1
        `;
        const params = [];

        if (id_pelanggan) {
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
        const [rows] = await promisePool.query(`
            SELECT t.*, p.nomor_meter, p.nama_pelanggan, p.alamat
            FROM tagihan t
            INNER JOIN pelanggan p ON t.id_pelanggan = p.id_pelanggan
            WHERE t.id_tagihan = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tagihan tidak ditemukan' });
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
