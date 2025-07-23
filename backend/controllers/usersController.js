const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, address, city, state, pincode } = req.body;
    if (!username || !email || !password || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    const user = new User({ username, email, password, phone, address, city, state, pincode });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    let msg = 'Invalid data';
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      msg = 'Email already exists';
    }
    res.status(400).json({ success: false, error: msg });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const { password: _, ...userData } = user.toObject();
    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '120m' });
    res.json({ success: true, data: { user: userData, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  try {
    const { username, email, phone, address, city, state, pincode, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.pincode = pincode || user.pincode;
    if (password) user.password = password;
    await user.save();
    const { password: _, ...userData } = user.toObject();
    res.json({ success: true, data: userData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'No user with that email' });
    const token = require('crypto').randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'SKMT Finance Password Reset',
      html: `<p>You requested a password reset for SKMT Finance.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });
    res.json({ success: true, message: 'Password reset link sent' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ success: false, error: 'Token and new password are required' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// User growth stats
exports.getGrowthStats = async (req, res) => {
  try {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      months.push({
        label: d.toLocaleString('default', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        start: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)),
        end: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)),
      });
    }
    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: months[0].start } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const result = months.map(m => {
      const d = m.start;
      const stat = userStats.find(s =>
        s._id.year === d.getUTCFullYear() && s._id.month === (d.getUTCMonth() + 1)
      );
      return { month: m.label, count: stat ? stat.count : 0 };
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 