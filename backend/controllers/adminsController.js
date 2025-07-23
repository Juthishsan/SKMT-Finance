const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Add a new admin
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }
    const admin = new Admin({ name, email, phone, password });
    await admin.save();
    const { password: _, ...adminData } = admin.toObject();
    res.status(201).json({ success: true, data: adminData });
  } catch (err) {
    let msg = 'Invalid data';
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      msg = 'Email already exists';
    }
    res.status(400).json({ success: false, error: msg });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json({ success: true, data: admins });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const { password: _, ...adminData } = admin.toObject();
    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '120m' });
    res.json({ success: true, data: { admin: adminData, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Update admin profile
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    const { password: _, ...adminData } = updatedAdmin.toObject();
    res.json({ success: true, data: adminData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Admin forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ success: false, error: 'No admin with that email' });
    const token = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();
    // Use frontend URL for reset link
    const resetUrl = `http://localhost:3001/admin-reset-password/${token}`;
    await sendEmail({
      to: admin.email,
      subject: 'SKMT Admin Password Reset',
      html: `
        <div style="background:#f4f4f7;padding:40px 0;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:32px 24px 24px 24px;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src='https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png' alt='SKMT Logo' style='width:64px;height:64px;margin-bottom:8px;' />
              <h2 style="color:#1a237e;margin:0 0 8px 0;">SKMT Admin Password Reset</h2>
            </div>
            <p style="font-size:16px;color:#333;margin-bottom:16px;">Hello Admin,</p>
            <p style="font-size:15px;color:#444;margin-bottom:24px;">
              We received a request to reset your SKMT Admin account password.<br>
              Click the button below to set a new password. This link will expire in <b>1 hour</b> for your security.
            </p>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background:#3949ab;color:#fff;text-decoration:none;border-radius:6px;font-size:16px;font-weight:600;box-shadow:0 2px 4px rgba(60,60,120,0.08);transition:background 0.2s;">Reset Password</a>
            </div>
            <p style="font-size:14px;color:#888;margin-bottom:16px;">
              If you did not request this password reset, please ignore this email or contact support immediately.<br>
              For your protection, do not share this email or your password with anyone.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <div style="text-align:center;font-size:13px;color:#aaa;">
              &copy; ${new Date().getFullYear()} SKMT Finance. All rights reserved.<br>
              <span style="color:#3949ab;">Trusted Loans & Finance Solutions</span>
            </div>
          </div>
        </div>
      `,
    });
    res.json({ success: true, message: 'Password reset link sent' });
  } catch (err) {
    console.error('Admin forgot password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Admin reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ success: false, error: 'Token and new password are required' });
  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!admin) return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    console.error('Admin reset password error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 