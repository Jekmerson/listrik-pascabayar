/**
 * USER ROUTES
 */
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
