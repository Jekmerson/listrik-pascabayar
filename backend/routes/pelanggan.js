/**
 * PELANGGAN ROUTES
 */
const express = require('express');
const router = express.Router();
const { getAllPelanggan, getPelangganById, createPelanggan, updatePelanggan, deletePelanggan } = require('../controllers/pelangganController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Semua route butuh authentication
router.use(verifyToken);

router.get('/', getAllPelanggan);
router.get('/:id', getPelangganById);
router.post('/', isAdmin, createPelanggan); // Admin only
router.put('/:id', isAdmin, updatePelanggan); // Admin only
router.delete('/:id', isAdmin, deletePelanggan); // Admin only

module.exports = router;
