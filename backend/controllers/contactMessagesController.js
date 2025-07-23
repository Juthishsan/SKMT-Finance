const ContactMessage = require('../models/ContactMessage');

// Submit a contact message
exports.submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone are required' });
    }
    const contact = new ContactMessage({ name, email, phone, service, message });
    await contact.save();
    res.status(201).json({ success: true, message: 'Message submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get all contact messages
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}; 