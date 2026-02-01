/**
 * PENGGUNAAN ROUTES
 */
const express = require('express');
const router = express.Router();
const { getAllPenggunaan, createPenggunaan, updatePenggunaan, deletePenggunaan } = require('../controllers/penggunaanController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getAllPenggunaan);
router.post('/', createPenggunaan);
router.put('/:id', updatePenggunaan);
router.delete('/:id', deletePenggunaan);

module.exports = router;
