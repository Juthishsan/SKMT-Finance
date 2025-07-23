// Product Controller
const Product = require('../models/Product');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Product not found' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const {
      name, price, stock, type, description, modelYear, owners, fc, fcDuration, fcUnit, insurance, insuranceDuration, insuranceUnit
    } = req.body;

    if (!name || !price || !stock || !type || !description || !modelYear || !owners || !fc || !insurance) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const productData = {
      name,
      price: parseFloat(price),
      stock: stock === 'true',
      type,
      description,
      modelYear: parseInt(modelYear),
      owners: parseInt(owners),
      fc: fc === 'true',
      insurance: insurance === 'true',
      images,
    };

    if (fc === 'true') {
      if (!fcDuration || !fcUnit) {
        return res.status(400).json({ success: false, error: 'FC duration and unit are required when FC is true' });
      }
      productData.fcDuration = parseInt(fcDuration);
      productData.fcUnit = fcUnit;
    }

    if (insurance === 'true') {
      if (!insuranceDuration || !insuranceUnit) {
        return res.status(400).json({ success: false, error: 'Insurance duration and unit are required when insurance is true' });
      }
      productData.insuranceDuration = parseInt(insuranceDuration);
      productData.insuranceUnit = insuranceUnit;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Edit a product
exports.editProduct = async (req, res) => {
  try {
    const {
      name, price, stock, type, description, modelYear, owners, fc, fcDuration, fcUnit, insurance, insuranceDuration, insuranceUnit
    } = req.body;

    const updateFields = {
      name,
      price: parseFloat(price),
      stock: stock === 'true',
      type,
      description,
      modelYear: parseInt(modelYear),
      owners: parseInt(owners),
      fc: fc === 'true',
      insurance: insurance === 'true',
    };

    if (fc === 'true') {
      if (!fcDuration || !fcUnit) {
        return res.status(400).json({ success: false, error: 'FC duration and unit are required when FC is true' });
      }
      updateFields.fcDuration = parseInt(fcDuration);
      updateFields.fcUnit = fcUnit;
    } else {
      updateFields.fcDuration = undefined;
      updateFields.fcUnit = undefined;
    }

    if (insurance === 'true') {
      if (!insuranceDuration || !insuranceUnit) {
        return res.status(400).json({ success: false, error: 'Insurance duration and unit are required when insurance is true' });
      }
      updateFields.insuranceDuration = parseInt(insuranceDuration);
      updateFields.insuranceUnit = insuranceUnit;
    } else {
      updateFields.insuranceDuration = undefined;
      updateFields.insuranceUnit = undefined;
    }

    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}; 