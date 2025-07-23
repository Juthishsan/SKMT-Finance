const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Boolean, required: true },
  type: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // Array of image URLs
  modelYear: { type: Number },
  owners: { type: Number },
  fc: { type: Boolean },
  fcDuration: { type: Number },
  fcUnit: { type: String, enum: ['year', 'month'], default: 'year' },
  insurance: { type: Boolean },
  insuranceDuration: { type: Number },
  insuranceUnit: { type: String, enum: ['year', 'month'], default: 'year' },
});

module.exports = mongoose.model('Product', ProductSchema); 