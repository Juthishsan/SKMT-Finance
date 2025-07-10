const mongoose = require('mongoose');

const LoanApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  loanType: { type: String, required: true },
  processed: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema); 