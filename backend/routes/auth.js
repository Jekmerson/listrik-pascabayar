/**
 * ============================================
 * AUTH ROUTES
 * ============================================
 */

const express = require('express');
const router = express.Router();
const { login, logout, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login - Login
router.post('/login', login);

// POST /api/auth/logout - Logout
router.post('/logout', logout);

// GET /api/auth/me - Get current user (protected)
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
