const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    to: process.env.GMAIL_USER,
    from: process.env.GMAIL_USER,
    subject: 'SKMT Finance: Nodemailer Test Email',
    html: `<div style="font-family: Arial, sans-serif; padding: 24px; background: #f4f8fb; border-radius: 12px; max-width: 400px; margin: 32px auto; text-align: center;">
      <h2 style="color: #1e3a8a;">Nodemailer Test Email</h2>
      <p style="color: #333;">This is a test email sent from your SKMT Finance backend using Nodemailer and your current Gmail credentials.</p>
      <div style="margin-top: 18px; color: #888; font-size: 0.98rem;">If you received this, your email setup is working!</div>
    </div>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully! Check your inbox.');
  } catch (err) {
    console.error('❌ Failed to send test email:', err);
  }
}

sendTestEmail(); 