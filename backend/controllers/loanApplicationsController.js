const LoanApplication = require('../models/LoanApplication');
const sendEmail = require('../utils/sendEmail');

// Submit a loan application
exports.submitLoanApplication = async (req, res) => {
  try {
    const { name, email, phone, amount, message, loanType } = req.body;
    if (!name || !email || !phone || !amount || !loanType) {
      return res.status(400).json({ success: false, error: 'All fields except message are required' });
    }
    const application = new LoanApplication({ name, email, phone, amount, message, loanType });
    await application.save();

    await sendEmail({
      to: email,
      subject: 'SKMT Finance: Loan Application Received',
      html: `
      <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
            <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
            <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Loan Application Received</h2>
          </div>
          <div style="padding: 32px 28px 18px 28px;">
            <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${name},</p>
            <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
              Thank you for applying for a loan with <b>SKMT Finance</b>! Your application has been received and is under review. Our team will contact you soon with the next steps.<br/><br/>
              We understand the importance of your financial needs and are committed to providing you with a smooth and transparent process.<br/>
              If you have any questions or need assistance at any stage, please feel free to reply to this email or contact our support team.<br/>
              <br/>
              We appreciate your trust in <b>SKMT Finance</b> and look forward to helping you achieve your goals!
            </p>
            <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Loan Application Details</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                <li><b>Name:</b> ${name}</li>
                <li><b>Email:</b> ${email}</li>
                <li><b>Phone:</b> ${phone}</li>
                <li><b>Loan Type:</b> ${loanType}</li>
                <li><b>Amount:</b> ₹${Number(amount).toLocaleString()}</li>
                <li><b>Message:</b> ${message || '-'}</li>
                <li><b>Applied On:</b> ${new Date(application.createdAt).toLocaleString()}</li>
                <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:#f59e42;color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">Pending</span></li>
              </ul>
            </div>
            <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
              <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
              <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
            </div>
          </div>
        </div>
      </div>
      `
    });

    res.status(201).json({ success: true, message: 'Loan application submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get all loan applications
exports.getAllLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Update loan application status
exports.updateLoanApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { processed: status === 'Processed', status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Loan application not found' });

    const statusColors = {
      Pending: '#f97316',
      Processed: '#10b981',
      Rejected: '#ef4444',
    };
    const badgeColor = statusColors[status] || '#f97316';
    await sendEmail({
      to: updated.email,
      subject: `Loan Application Status Update | SKMT Finance`,
      html: `
      <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
            <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
            <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Loan Application Status Updated</h2>
          </div>
          <div style="padding: 32px 28px 18px 28px;">
            <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${updated.name},</p>
            <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
              The status of your loan application has been updated to <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${status}</span>.
              <br/><br/>
              ${status === 'Pending' ? `
                We have received your loan application and it is currently <b>pending</b> review. Our team will contact you soon with further details.<br/>
                If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                Thank you for choosing <b>SKMT Finance</b>!
              ` : status === 'Processed' ? `
                Good news! Your loan application has been <b>processed</b> successfully. Our team will reach out to you with the next steps.<br/>
                If you have any questions or need further assistance, please let us know.<br/>
                <br/>
                Thank you for trusting <b>SKMT Finance</b>!
              ` : status === 'Rejected' ? `
                We regret to inform you that your loan application has been <b>rejected</b>. If you believe this is a mistake or need more information, please contact our support team.<br/>
                <br/>
                Thank you for considering <b>SKMT Finance</b>.
              ` : `
                If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                Thank you for choosing <b>SKMT Finance</b>!
              `}
            </p>
            <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Loan Application Details</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                <li><b>Name:</b> ${updated.name}</li>
                <li><b>Email:</b> ${updated.email}</li>
                <li><b>Phone:</b> ${updated.phone}</li>
                <li><b>Loan Type:</b> ${updated.loanType}</li>
                <li><b>Amount:</b> ₹${Number(updated.amount).toLocaleString()}</li>
                <li><b>Message:</b> ${updated.message || '-'}</li>
                <li><b>Applied On:</b> ${new Date(updated.createdAt).toLocaleString()}</li>
                <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${status}</span></li>
              </ul>
            </div>
            <div style="margin: 24px 0 0 0; border-top: 1.5px solid #e5e7eb; padding-top: 18px; text-align: center; color: #6b7280; font-size: 0.98rem;">
              <div style="margin-bottom: 6px;">If you have any questions, reply to this email or contact us at <a href="mailto:skmtfinanceandconsulting@gmail.com" style="color: #1e3a8a; text-decoration: underline;">skmtfinanceandconsulting@gmail.com</a>.</div>
              <div style="margin-top: 8px;">Thank you for choosing <b>SKMT Finance</b>. We look forward to serving you!</div>
            </div>
          </div>
        </div>
      </div>
      `
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get loan applications by user email
exports.getLoanApplicationsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
    const applications = await LoanApplication.find({ email }).sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Cancel a loan application
exports.cancelLoanApplication = async (req, res) => {
  try {
    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { cancelled: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Loan application not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Delete a loan application
exports.deleteLoanApplication = async (req, res) => {
  try {
    const deleted = await LoanApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}; 