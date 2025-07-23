const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const Product = require('../models/Product');
const { authenticateJWT } = require('../middleware/auth'); // Corrected import
const { getAllProducts, getProductById, addProduct, editProduct, deleteProduct } = require('../controllers/productsController');
const upload = require('../utils/multerProductUpload');

// Get all products
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Add a new product
router.post('/', authenticateJWT, upload.array('images', 10), addProduct);

// Edit a product
router.put('/:id', authenticateJWT, upload.array('images', 10), editProduct);

// Delete a product
router.delete('/:id', authenticateJWT, deleteProduct);

module.exports = router;