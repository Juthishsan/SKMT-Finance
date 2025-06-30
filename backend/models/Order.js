const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userSnapshot: {
    _id: String,
    username: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  productSnapshot: {
    _id: String,
    name: String,
    price: Number,
    type: String,
    modelYear: String,
    owners: String,
    fcYears: String,
    insurance: mongoose.Schema.Types.Mixed,
    images: [String],
    description: String,
  },
  orderDate: { type: Date, default: Date.now },
  orderstatus: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', OrderSchema); 