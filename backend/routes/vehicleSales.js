const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { createVehicleSale, getAllVehicleSales, updateVehicleSaleStatus, getVehicleSalesByUser, deleteVehicleSale } = require('../controllers/vehicleSalesController');
const upload = require('../utils/multerVehicleUpload');

// Create a new vehicle sale
router.post('/', authenticateJWT, upload.array('images', 10), createVehicleSale);

// Get all vehicle sales
router.get('/', authenticateJWT, getAllVehicleSales);

// Get vehicle sales by user
router.get('/user/:userId', getVehicleSalesByUser);

// Update vehicle sale status
router.put('/:id', authenticateJWT, updateVehicleSaleStatus);

// Delete a vehicle sale
router.delete('/:id', authenticateJWT, deleteVehicleSale);

module.exports = router;