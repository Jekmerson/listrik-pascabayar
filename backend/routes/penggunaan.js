/**
 * PENGGUNAAN ROUTES
 */
const express = require('express');
const router = express.Router();
const { getAllPenggunaan, createPenggunaan, updatePenggunaan, deletePenggunaan } = require('../controllers/penggunaanController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getAllPenggunaan);
router.post('/', isAdmin, createPenggunaan);
router.put('/:id', isAdmin, updatePenggunaan);
router.delete('/:id', isAdmin, deletePenggunaan);

module.exports = router;
