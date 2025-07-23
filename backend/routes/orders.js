const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { createOrder, getAllOrders, updateOrderStatus, deleteOrder, getRecentOrders } = require('../controllers/ordersController');

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', authenticateJWT, getAllOrders);

// Update order status
router.put('/:id/status', authenticateJWT, updateOrderStatus);

// Delete an order
router.delete('/:id', authenticateJWT, deleteOrder);

// Get recent orders
router.get('/recent', authenticateJWT, getRecentOrders);

module.exports = router;