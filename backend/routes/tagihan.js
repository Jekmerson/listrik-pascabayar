/**
 * TAGIHAN ROUTES
 */
const express = require('express');
const router = express.Router();
const { getAllTagihan, getTagihanById, bayarTagihan } = require('../controllers/tagihanController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getAllTagihan);
router.get('/:id', getTagihanById);
router.put('/:id/bayar', bayarTagihan);

module.exports = router;
