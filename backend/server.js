require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }));
}

// Routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admins');
const orderRoutes = require('./routes/orders');
const loanApplicationRoutes = require('./routes/loanApplications');
const contactMessageRoutes = require('./routes/contactMessages');
const vehicleSaleRoutes = require('./routes/vehicleSales');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/loan-applications', loanApplicationRoutes);
app.use('/api/contact-messages', contactMessageRoutes);
app.use('/api/vehicle-sales', vehicleSaleRoutes);
app.use('/api', dashboardRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));