const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderDate: { type: Date, default: Date.now },
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String },
  orderstatus: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', OrderSchema); 