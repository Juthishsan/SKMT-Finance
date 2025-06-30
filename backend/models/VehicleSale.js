const mongoose = require('mongoose');

const VehicleSaleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  year: { type: Number, required: true },
  fuel: { type: String, required: true },
  transmission: { type: String, required: true },
  kmDriven: { type: Number, required: true },
  owners: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleSale', VehicleSaleSchema); 