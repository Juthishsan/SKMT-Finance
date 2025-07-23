const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { submitLoanApplication, getAllLoanApplications, updateLoanApplicationStatus, getLoanApplicationsByEmail, cancelLoanApplication, deleteLoanApplication } = require('../controllers/loanApplicationsController');

// Submit a loan application
router.post('/', submitLoanApplication);

// Get all loan applications
router.get('/', authenticateJWT, getAllLoanApplications);

// Get loan applications by user email
router.get('/user', getLoanApplicationsByEmail);

// Mark a loan application as processed
router.patch('/:id', authenticateJWT, updateLoanApplicationStatus);

// Cancel a loan application
router.patch('/:id/cancel', authenticateJWT, cancelLoanApplication);

// Delete a loan application
router.delete('/:id', authenticateJWT, deleteLoanApplication);

module.exports = router;