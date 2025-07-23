const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { addAdmin, getAllAdmins, loginAdmin, deleteAdmin, updateAdmin, forgotPassword, resetPassword } = require('../controllers/adminsController');

// Add a new admin
router.post('/', authenticateJWT, addAdmin);

// Get all admins
router.get('/', authenticateJWT, getAllAdmins);

// Delete an admin
router.delete('/:id', authenticateJWT, deleteAdmin);

// Admin login
router.post('/login', loginAdmin);

// Update admin profile
router.put('/:id', authenticateJWT, updateAdmin);

// Admin Forgot Password
router.post('/forgot-password', forgotPassword);

// Admin Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;