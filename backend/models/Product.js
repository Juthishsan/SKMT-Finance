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
  fcYears: { type: Number },
  insurance: { type: Boolean },
});

module.exports = mongoose.model('Product', ProductSchema); 