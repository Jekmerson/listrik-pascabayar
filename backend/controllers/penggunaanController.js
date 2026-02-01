/**
 * PENGGUNAAN CONTROLLER - CRUD Penggunaan Listrik
 */
const { promisePool } = require('../config/database');

// GET all penggunaan
const getAllPenggunaan = async (req, res) => {
    try {
        const { id_pelanggan, bulan, tahun } = req.query;

        let query = 'SELECT * FROM view_penggunaan_listrik WHERE 1=1';
        const params = [];

        if (id_pelanggan) {
            query += ' AND id_pelanggan = ?';
            params.push(id_pelanggan);
        }
        if (bulan) {
            query += ' AND bulan = ?';
            params.push(bulan);
        }
        if (tahun) {
            query += ' AND tahun = ?';
            params.push(tahun);
        }

        const [rows] = await promisePool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data penggunaan' });
    }
};

// CREATE penggunaan (akan auto-generate tagihan via trigger)
const createPenggunaan = async (req, res) => {
    try {
        const { id_pelanggan, bulan, tahun, meter_awal, meter_akhir } = req.body;

        if (meter_akhir <= meter_awal) {
            return res.status(400).json({ success: false, message: 'Meter akhir harus lebih besar dari meter awal' });
        }

        const [result] = await promisePool.query(
            'INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir) VALUES (?, ?, ?, ?, ?)',
            [id_pelanggan, bulan, tahun, meter_awal, meter_akhir]
        );

        res.status(201).json({
            success: true,
            message: 'Data penggunaan berhasil ditambahkan. Tagihan otomatis dibuat.',
            data: { id_penggunaan: result.insertId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menambah data penggunaan' });
    }
};

// UPDATE penggunaan
const updatePenggunaan = async (req, res) => {
    try {
        const { meter_awal, meter_akhir } = req.body;

        if (meter_akhir <= meter_awal) {
            return res.status(400).json({ success: false, message: 'Meter akhir harus lebih besar dari meter awal' });
        }

        await promisePool.query(
            'UPDATE penggunaan SET meter_awal=?, meter_akhir=? WHERE id_penggunaan=?',
            [meter_awal, meter_akhir, req.params.id]
        );

        res.json({ success: true, message: 'Data penggunaan berhasil diupdate' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengupdate data penggunaan' });
    }
};

// DELETE penggunaan
const deletePenggunaan = async (req, res) => {
    try {
        await promisePool.query('DELETE FROM penggunaan WHERE id_penggunaan = ?', [req.params.id]);
        res.json({ success: true, message: 'Data penggunaan berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data penggunaan' });
    }
};

module.exports = { getAllPenggunaan, createPenggunaan, updatePenggunaan, deletePenggunaan };
