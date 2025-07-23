const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// GET /api/dashboard-stats
router.get('/dashboard-stats', authenticateJWT, getDashboardStats);

module.exports = router; 