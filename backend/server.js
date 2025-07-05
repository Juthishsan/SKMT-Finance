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

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '15m';

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
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
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
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
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
    console.log('Order POST body:', req.body); // Debug log
    const { userSnapshot, productSnapshot } = req.body;
    if (!userSnapshot || !productSnapshot) {
      return res.status(400).json({ error: 'User and product details are required.' });
    }
    const order = new Order({ userSnapshot, productSnapshot });
    await order.save();
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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 