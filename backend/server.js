require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Product = require('./models/Product');
const multer = require('multer');
const path = require('path');
const Admin = require('./models/Admin');
const Order = require('./models/Order');
const LoanApplication = require('./models/LoanApplication');
const ContactMessage = require('./models/ContactMessage');
const VehicleSale = require('./models/VehicleSale');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL;

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '120m';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// JWT authentication middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
}

// Sample route: Get all users
app.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sample route: Add a user
app.post('/api/users', async (req, res) => {
  console.log('Register endpoint hit');
  try {
    const { username, email, password, phone, address, city, state, pincode } = req.body;
    if (!username || !email || !password || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const user = new User({ username, email, password, phone, address, city, state, pincode });
    console.log('User model:', user.constructor.modelName);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    let msg = 'Invalid data';
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      msg = 'Email already exists.';
    }
    res.status(400).json({ error: msg });
  }
});

// Delete a user
app.delete('/api/users/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Add a new product
app.post('/api/products', upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, stock, type, description, modelYear, owners, fcYears, insurance } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const product = new Product({
      name,
      price,
      stock,
      type,
      description,
      images,
      modelYear,
      owners,
      fcYears,
      insurance: insurance === 'true' || insurance === true
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err); // Log full error
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Edit a product
app.put('/api/products/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, stock, type, description, modelYear, owners, fcYears, insurance } = req.body;
    const updateFields = {
      name,
      price,
      stock,
      type,
      description,
      modelYear,
      owners,
      fcYears,
      insurance: insurance === 'true' || insurance === true
    };
    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { password: _, ...userData } = user.toObject();
    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ message: 'Login successful', user: userData, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all admins
app.get('/api/admins', authenticateJWT, async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new admin
app.post('/api/admins', authenticateJWT, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const admin = new Admin({ name, email, phone, password });
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    let msg = 'Invalid data';
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      msg = 'Email already exists.';
    }
    res.status(400).json({ error: msg });
  }
});

// Delete an admin
app.delete('/api/admins/:id', authenticateJWT, async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Admin login
app.post('/api/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log('Admin login attempt:', email, password);
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // console.log('Admin not found');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // console.log('Admin found:', admin.email, admin.password);
    const isMatch = await bcrypt.compare(password, admin.password);
    // console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ message: 'Login successful', admin: { name: admin.name, email: admin.email, _id: admin._id }, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const [productCount, userCount, orderCount, products] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Product.find()
    ]);
    const categorySet = new Set(products.map(p => p.type));
    const categoryCount = categorySet.size;
    res.json({ productCount, categoryCount, userCount, orderCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Recent orders endpoint
app.get('/api/recent-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).limit(10);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Loan Application endpoint
app.post('/api/loan-applications', async (req, res) => {
  try {
    const { name, email, phone, amount, message, loanType } = req.body;
    if (!name || !email || !phone || !amount || !loanType) {
      return res.status(400).json({ error: 'All fields except message are required.' });
    }
    const application = new LoanApplication({ name, email, phone, amount, message, loanType });
    await application.save();

    // Send confirmation email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      port: 587,
      secure: false
    });
    const mailOptions = {
      to: email,
      from: process.env.GMAIL_USER,
      subject: 'SKMT Finance: Loan Application Received',
      html: `
        <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
              <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
              <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Loan Application Received</h2>
            </div>
            <div style="padding: 32px 28px 18px 28px;">
              <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Dear ${name},</p>
                <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">Thank you for applying for a <b>${loanType}</b> with SKMT Finance. We have received your application and our team will review your details and contact you soon.</p>
              </div>
              <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Application Details</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                  <li><b>Name:</b> ${name}</li>
                  <li><b>Email:</b> ${email}</li>
                  <li><b>Phone:</b> ${phone}</li>
                  <li><b>Loan Type:</b> ${loanType}</li>
                  <li><b>Amount:</b> ₹${Number(amount).toLocaleString()}</li>
                  <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:#f97316;color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">Received</span></li>
                  ${message ? `<li><b>Message:</b> ${message}</li>` : ''}
                </ul>
              </div>
              <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
              </div>
            </div>
          </div>
        </div>
      `
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      // Log but do not fail the request if email fails
      console.error('Loan application email error:', emailErr);
    }

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all loan applications (admin)
app.get('/api/loan-applications', authenticateJWT, async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete a loan application
app.delete('/api/loan-applications/:id', authenticateJWT, async (req, res) => {
  try {
    const deleted = await LoanApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Mark a loan application as processed
app.patch('/api/loan-applications/:id', authenticateJWT, async (req, res) => {
  try {
    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { $set: { processed: true } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Application not found' });

    // Send status update email to user
    try {
      const statusLabel = updated.cancelled ? 'Cancelled' : (updated.processed ? 'Processed' : 'Pending');
      const statusColors = {
        Pending: '#f59e42',
        Processed: '#10b981',
        Cancelled: '#dc2626',
      };
      const badgeColor = statusColors[statusLabel] || '#f59e42';
      const transporter = require('nodemailer').createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        port: 587,
        secure: false
      });
      const mailOptions = {
        to: updated.email,
        from: process.env.GMAIL_USER,
        subject: `Loan Application Status Update | SKMT Finance`,
        html: `
          <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
                <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
                <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Loan Application Status Updated</h2>
              </div>
              <div style="padding: 32px 28px 18px 28px;">
                <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                  <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${updated.name || ''},</p>
                  <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">The status of your loan application has been updated to <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${statusLabel}</span>.</p>
                </div>
                <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                  <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Loan Application Details</h4>
                  <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                    <li><b>Name:</b> ${updated.name || '-'}</li>
                    <li><b>Email:</b> ${updated.email || '-'}</li>
                    <li><b>Phone:</b> ${updated.phone || '-'}</li>
                    <li><b>Loan Type:</b> ${updated.loanType || '-'}</li>
                    <li><b>Amount:</b> ₹${updated.amount ? Number(updated.amount).toLocaleString() : '-'}</li>
                    <li><b>Message:</b> ${updated.message || '-'}</li>
                    <li><b>Applied On:</b> ${updated.createdAt ? new Date(updated.createdAt).toLocaleString() : '-'}</li>
                    <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${statusLabel}</span></li>
                  </ul>
                </div>
                <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                  <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                  <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
                </div>
              </div>
            </div>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Loan application status email error:', emailErr);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Cancel a loan application (admin)
app.patch('/api/loan-applications/:id/cancel', async (req, res) => {
  try {
    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { cancelled: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Loan application not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Contact form endpoint
app.post('/api/contact-messages', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }
    const contact = new ContactMessage({ name, email, phone, service, message });
    await contact.save();
    res.status(201).json({ message: 'Message submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all contact messages (admin)
app.get('/api/contact-messages', authenticateJWT, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update user details
app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, email, phone, address, city, state, pincode, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.username = username;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.city = city;
    user.state = state;
    user.pincode = pincode;
    if (password) user.password = password; // Will be hashed by pre-save hook
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all loan applications for a specific user by email
app.get('/api/user-loan-applications', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const applications = await LoanApplication.find({ email }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// === Vehicle Sale APIs ===

// Create a new vehicle sale (user)
app.post('/api/vehicle-sales', upload.array('images', 10), async (req, res) => {
  try {
    const { user, brand, year, fuel, transmission, kmDriven, owners, title, description, price } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const sale = new VehicleSale({
      user,
      brand,
      year,
      fuel,
      transmission,
      kmDriven,
      owners,
      title,
      description,
      price,
      images
    });
    await sale.save();

    // Fetch user details for email
    let userDoc = null;
    try {
      userDoc = await User.findById(user);
    } catch (e) {}
    if (userDoc && userDoc.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        port: 587,
        secure: false
      });
      const vehicleImage = images.length > 0 ? `http://localhost:5000${images[0]}` : null;
      const mailOptions = {
        to: userDoc.email,
        from: process.env.GMAIL_USER,
        subject: `SKMT Finance: Vehicle Sale Submission Received!`,
        html: `
          <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
                <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
                <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Vehicle Sale Submission Received</h2>
              </div>
              <div style="padding: 32px 28px 18px 28px;">
                <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                  <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userDoc.username || ''},</p>
                  <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">Thank you for submitting your vehicle <b>${title}</b> for sale! Your request has been received and is under review. Our team will verify your details and contact you soon with the next steps.</p>
                </div>
                <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                  <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Vehicle Sale Details</h4>
                  <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                    <li><b>Vehicle:</b> ${title}</li>
                    <li><b>Brand:</b> ${brand}</li>
                    <li><b>Year:</b> ${year}</li>
                    <li><b>Fuel:</b> ${fuel}</li>
                    <li><b>Transmission:</b> ${transmission}</li>
                    <li><b>Kilometers Driven:</b> ${kmDriven}</li>
                    <li><b>Owners:</b> ${owners}</li>
                    <li><b>Price:</b> ₹${Number(price).toLocaleString()}</li>
                    <li><b>Description:</b> ${description}</li>
                    <li><b>Name:</b> ${userDoc.username || ''}</li>
                    <li><b>Email:</b> ${userDoc.email}</li>
                    <li><b>Phone:</b> ${userDoc.phone || ''}</li>
                    ${vehicleImage ? `<li style=\"margin-top: 12px;\"><img src=\"${vehicleImage}\" alt=\"Vehicle Image\" style=\"max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;\" /></li>` : ''}
                  </ul>
                </div>
                <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                  <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                  <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
                </div>
              </div>
            </div>
          </div>
        `
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error('Vehicle order email error:', emailErr);
      }
    }

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all vehicle sales (admin)
app.get('/api/vehicle-sales', async (req, res) => {
  try {
    const sales = await VehicleSale.find().populate('user', 'username email phone address city state pincode createdAt');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get vehicle sales by user
app.get('/api/vehicle-sales/user/:userId', async (req, res) => {
  try {
    const sales = await VehicleSale.find({ user: req.params.userId });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update vehicle sale status (admin approve/reject)
app.put('/api/vehicle-sales/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await VehicleSale.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email phone');
    if (!updated) return res.status(404).json({ error: 'Not found' });

    // Send status update email to user
    try {
      const user = updated.user;
      if (user && user.email) {
        const statusLabel = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending';
        const statusColors = {
          Pending: '#f59e42',
          Approved: '#10b981',
          Rejected: '#dc2626',
        };
        const badgeColor = statusColors[statusLabel] || '#f59e42';
        const transporter = require('nodemailer').createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
          port: 587,
          secure: false
        });
        const mailOptions = {
          to: user.email,
          from: process.env.GMAIL_USER,
          subject: `Vehicle Sale Status Update | SKMT Finance`,
          html: `
            <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
              <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
                <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
                  <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
                  <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Vehicle Sale Status Updated</h2>
                </div>
                <div style="padding: 32px 28px 18px 28px;">
                  <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                    <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${user.username || ''},</p>
                    <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">Your vehicle sale submission for <b>${updated.title}</b> has been <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${statusLabel}</span>. Our team will contact you for the furthur process. Stay Tuned!!</p>
                  </div>
                  <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                    <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Vehicle Details</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                      <li><b>Title:</b> ${updated.title || '-'}</li>
                      <li><b>Brand:</b> ${updated.brand || '-'}</li>
                      <li><b>Year:</b> ${updated.year || '-'}</li>
                      <li><b>Fuel:</b> ${updated.fuel || '-'}</li>
                      <li><b>Transmission:</b> ${updated.transmission || '-'}</li>
                      <li><b>Kilometers Driven:</b> ${updated.kmDriven || '-'}</li>
                      <li><b>Owners:</b> ${updated.owners || '-'}</li>
                      <li><b>Price:</b> ₹${updated.price ? Number(updated.price).toLocaleString() : '-'}</li>
                      <li><b>Description:</b> ${updated.description || '-'}</li>
                      <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${statusLabel}</span></li>
                    </ul>
                  </div>
                  <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                    <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                    <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
                  </div>
                </div>
              </div>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailErr) {
      console.error('Vehicle sale status email error:', emailErr);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete a vehicle sale (admin)
app.delete('/api/vehicle-sales/:id', async (req, res) => {
  try {
    const deleted = await VehicleSale.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Vehicle sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Create a new order with user and product snapshots
app.post('/api/orders', async (req, res) => {
  try {
    //console.log('Order POST body:', req.body); // Debug log
    const { userSnapshot, productSnapshot } = req.body;
    if (!userSnapshot || !productSnapshot) {
      return res.status(400).json({ error: 'User and product details are required.' });
    }
    const order = new Order({ userSnapshot, productSnapshot });
    await order.save();

    // Send order confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        port: 587,
        secure: false
      });
      const mailOptions = {
        to: userSnapshot.email,
        from: process.env.GMAIL_USER,
        subject: `Booking Confirmation - ${productSnapshot.name} | SKMT Finance`,
        html: `
          <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
                <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; width:48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
                <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Booking Successfully!</h2>
              </div>
              <div style="padding: 32px 28px 18px 28px;">
                <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                  <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userSnapshot.username || ''},</p>
                  <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">Thank you for your Booking! Your request for <b>${productSnapshot.name}</b> has been received and is being processed. Our team will contact you soon with further details.</p>
                </div>
                <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                  <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Booking Details</h4>
                  <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                    <li><b>Product:</b> ${productSnapshot.name}</li>
                    <li><b>Type:</b> ${productSnapshot.type}</li>
                    <li><b>Price:</b> ₹${Number(productSnapshot.price).toLocaleString()}</li>
                    <li><b>Order Date:</b> ${new Date(order.orderDate).toLocaleString()}</li>
                    <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:#f97316;color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${order.orderstatus || 'Pending'}</span></li>
                    <li><b>Name:</b> ${userSnapshot.username || ''}</li>
                    <li><b>Email:</b> ${userSnapshot.email}</li>
                    <li><b>Phone:</b> ${userSnapshot.phone || ''}</li>
                    ${productSnapshot.images && productSnapshot.images.length > 0 ? `<li style="margin-top: 12px;"><img src="${BASE_URL}${productSnapshot.images[0]}" alt="Product Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
                  </ul>
                </div>
                <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                  <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                  <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
                </div>
              </div>
            </div>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Order confirmation email error:', emailErr);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Order save error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderstatus: status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    // Send status update email to user
    try {
      const { userSnapshot, productSnapshot, orderDate, orderstatus } = updated;
      let prod = productSnapshot || {};
      // If productSnapshot is a string (product ID), fetch the full product
      if (typeof prod === 'string') {
        const Product = require('./models/Product');
        const dbProduct = await Product.findById(prod);
        if (dbProduct) {
          prod = dbProduct.toObject();
        } else {
          prod = {};
        }
      }
      const prodName = prod.name || '-';
      const prodType = prod.type || '-';
      const prodPrice = prod.price !== undefined && prod.price !== null ? Number(prod.price).toLocaleString() : '-';
      const prodImages = Array.isArray(prod.images) ? prod.images : [];
      if (!prod.name || !prod.type || prod.price === undefined) {
        console.warn('Order status email: productSnapshot incomplete:', prod);
      }
      const transporter = require('nodemailer').createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        port: 587,
        secure: false
      });
      const statusColors = {
        Pending: '#f97316',
        Processing: '#3b82f6',
        Completed: '#10b981',
        Cancelled: '#ef4444',
      };
      const badgeColor = statusColors[orderstatus] || '#f97316';
      const mailOptions = {
        to: userSnapshot.email,
        from: process.env.GMAIL_USER,
        subject: `Booking Status Update - ${prodName} | SKMT Finance`,
        html: `
          <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
            <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
              <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
                <img src="${BASE_URL}/uploads/skmt%20logo%20(1).png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
                <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Booking Status Updated</h2>
              </div>
              <div style="padding: 32px 28px 18px 28px;">
                <div style="border-left: 5px solid #1e3a8a; padding-left: 18px; margin-bottom: 18px;">
                  <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userSnapshot.username || ''},</p>
                  <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">The status of your order for <b>${prodName}</b> has been updated to <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${orderstatus}</span>.</p>
                </div>
                <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6;">
                  <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Booking Details</h4>
                  <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                    <li><b>Product:</b> ${prodName}</li>
                    <li><b>Type:</b> ${prodType}</li>
                    <li><b>Price:</b> ₹${prodPrice}</li>
                    <li><b>Booking Date:</b> ${new Date(orderDate).toLocaleString()}</li>
                    <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${orderstatus}</span></li>
                    <li><b>Name:</b> ${userSnapshot.username || ''}</li>
                    <li><b>Email:</b> ${userSnapshot.email}</li>
                    <li><b>Phone:</b> ${userSnapshot.phone || ''}</li>
                    ${prodImages.length > 0 ? `<li style="margin-top: 12px;"><img src="${BASE_URL}${prodImages[0]}" alt="Product Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
                  </ul>
                </div>
                <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
                  <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
                  <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
                </div>
              </div>
            </div>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Order status update email error:', emailErr);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Delete an order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Update admin profile
app.put('/api/admins/:id', authenticateJWT, async (req, res) => {
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
      return res.status(404).json({ error: 'Admin not found' });
    }
    // Exclude password from response
    const { password, ...adminData } = updatedAdmin.toObject();
    res.json(adminData);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Forgot Password Endpoint
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No user with that email.' });
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      port: 587,
      secure: false
    });
    const resetUrl = `${BASE_URL}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: 'SKMT Finance Password Reset',
      html: `<p>You requested a password reset for SKMT Finance.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Reset Password Endpoint
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password are required.' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token.' });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password has been reset.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin Forgot Password Endpoint
app.post('/api/admin-forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'No admin with that email.' });
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await admin.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      port: 587,
      secure: false
    });
    const resetUrl = `${BASE_URL}/admin-reset-password/${token}`;
    const mailOptions = {
      to: admin.email,
      from: process.env.GMAIL_USER,
      subject: 'SKMT Admin Password Reset',
      html: `<p>You requested a password reset for SKMT Admin.</p><p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent.' });
  } catch (err) {
    console.error('Admin forgot password error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Admin Reset Password Endpoint
app.post('/api/admin-reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password are required.' });
  try {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!admin) return res.status(400).json({ error: 'Invalid or expired token.' });
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();
    res.json({ message: 'Password has been reset.' });
  } catch (err) {
    console.error('Admin reset password error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// User growth stats endpoint (users registered per month for last 6 months)
app.get('/api/user-growth-stats', authenticateJWT, async (req, res) => {
  try {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      // Use UTC for month calculation
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      months.push({
        label: d.toLocaleString('default', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
        start: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)),
        end: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
      });
    }
    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: months[0].start } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    // Remove debug logging
    // console.log('Months:', months.map(m => ({ label: m.label, start: m.start, end: m.end })));
    // console.log('UserStats:', userStats);
    // console.log('Result:', result);
    // Also remove mapping debug log
    const result = months.map(m => {
      const d = m.start;
      const stat = userStats.find(s =>
        s._id.year === d.getUTCFullYear() && s._id.month === (d.getUTCMonth() + 1)
      );
      return { month: m.label, count: stat ? stat.count : 0 };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Backend API is running!!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 