const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { authenticateJWT } = require('../middleware/auth');
const { registerUser, getAllUsers, loginUser, updateUser, deleteUser, forgotPassword, resetPassword, getGrowthStats } = require('../controllers/usersController');

// Register a new user
router.post('/', registerUser);

// Get all users
router.get('/', authenticateJWT, getAllUsers);

// Delete a user
router.delete('/:id', authenticateJWT, deleteUser);

// User login
router.post('/login', loginUser);

// Update user details
router.put('/:id', authenticateJWT, updateUser);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// User growth stats
router.get('/growth-stats', authenticateJWT, getGrowthStats);

module.exports = router;