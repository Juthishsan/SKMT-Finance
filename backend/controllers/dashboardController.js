const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const VehicleSale = require('../models/VehicleSale');

exports.getDashboardStats = async (req, res) => {
  try {
    const [productCount, userCount, orderCount, vehicleSaleCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      VehicleSale.countDocuments(),
    ]);
    res.json({
      success: true,
      data: {
        productCount,
        userCount,
        orderCount,
        vehicleSaleCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}; 