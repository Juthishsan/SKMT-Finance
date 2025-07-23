const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authenticateJWT } = require('../middleware/auth');
const { submitContactMessage, getAllContactMessages } = require('../controllers/contactMessagesController');

// Submit a contact message
router.post('/', submitContactMessage);

// Get all contact messages
router.get('/', authenticateJWT, getAllContactMessages);

module.exports = router;