const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  port: 587,
  secure: false,
});

const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      ...options,
    });
    // console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error(`Email sending error to ${options.to}:`, error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;