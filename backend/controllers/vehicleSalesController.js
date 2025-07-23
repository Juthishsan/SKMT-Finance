const VehicleSale = require('../models/VehicleSale');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Create a new vehicle sale
exports.createVehicleSale = async (req, res) => {
  try {
    const {
      user, brand, year, fuel, transmission, kmDriven, owners, title, description, price, fc, fcDuration, fcUnit, insurance, insuranceDuration, insuranceUnit
    } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const saleData = {
      user,
      brand,
      year: parseInt(year),
      fuel,
      transmission,
      kmDriven: parseInt(kmDriven),
      owners: parseInt(owners),
      title,
      description,
      price: parseFloat(price),
      images,
      fc: fc === 'true' || fc === true || fc === 'Yes' ? 'Yes' : 'No',
      insurance: insurance === 'true' || insurance === true || insurance === 'Yes' ? 'Yes' : 'No',
    };

    if (saleData.fc === 'Yes') {
      if (!fcDuration || !fcUnit) {
        return res.status(400).json({ success: false, error: 'FC duration and unit are required when FC is true' });
      }
      saleData.fcDuration = parseInt(fcDuration);
      saleData.fcUnit = fcUnit;
    } else {
      saleData.fcDuration = null;
      saleData.fcUnit = 'year';
    }

    if (saleData.insurance === 'Yes') {
      if (!insuranceDuration || !insuranceUnit) {
        return res.status(400).json({ success: false, error: 'Insurance duration and unit are required when insurance is true' });
      }
      saleData.insuranceDuration = parseInt(insuranceDuration);
      saleData.insuranceUnit = insuranceUnit;
    } else {
      saleData.insuranceDuration = null;
      saleData.insuranceUnit = 'year';
    }

    const sale = new VehicleSale(saleData);
    await sale.save();

    const userDoc = await User.findById(user);
    if (userDoc && userDoc.email) {
      await sendEmail({
        to: userDoc.email,
        subject: 'SKMT Finance: Vehicle Sale Submission Received',
        html: `
        <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
              <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
              <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Vehicle Sale Submission Received</h2>
            </div>
            <div style="padding: 32px 28px 18px 28px;">
              <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userDoc.username},</p>
              <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
                Thank you for submitting your vehicle <b>${title}</b> for sale! Your request has been received and is under review. Our team will verify your details and contact you soon with the next steps.<br/><br/>
                We appreciate your trust in <b>SKMT Finance</b> to help you with your vehicle sale. Our goal is to make the process smooth, transparent, and rewarding for you.<br/>
                If you have any questions or need assistance at any stage, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                We look forward to assisting you and ensuring a successful sale experience!
              </p>
              <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Vehicle Sale Details</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                  <li><b>Vehicle:</b> ${title}</li>
                  <li><b>Brand:</b> ${brand}</li>
                  <li><b>Year:</b> ${year}</li>
                  <li><b>Fuel:</b> ${fuel}</li>
                  <li><b>Transmission:</b> ${transmission}</li>
                  <li><b>Kilometers Driven:</b> ${kmDriven}</li>
                  <li><b>Owners:</b> ${owners}</li>
                  <li><b>Price:</b> ₹${price}</li>
                  <li><b>Description:</b> ${description}</li>
                  <li><b>Name:</b> ${userDoc.username}</li>
                  <li><b>Email:</b> ${userDoc.email}</li>
                  <li><b>Phone:</b> ${userDoc.phone}</li>
                  ${images && images.length > 0 ? `<li style="margin-top: 12px;"><img src="${images[0]}" alt="Vehicle Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
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
    }

    res.status(201).json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get all vehicle sales
exports.getAllVehicleSales = async (req, res) => {
  try {
    const sales = await VehicleSale.find().sort({ createdAt: -1 }).populate('user', 'username email phone address city state pincode createdAt');
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Update vehicle sale status
exports.updateVehicleSaleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await VehicleSale.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email phone address city state pincode createdAt');
    if (!updated) return res.status(404).json({ success: false, error: 'Vehicle sale not found' });

    const userDoc = updated.user;
    const statusColors = {
      pending: '#f97316',
      approved: '#10b981',
      rejected: '#ef4444',
    };
    const badgeColor = statusColors[status] || '#f97316';
    if (userDoc && userDoc.email) {
      await sendEmail({
        to: userDoc.email,
        subject: `Vehicle Sale Status Update - ${updated.title} | SKMT Finance`,
        html: `
        <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
              <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
              <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Vehicle Sale Status Updated</h2>
            </div>
            <div style="padding: 32px 28px 18px 28px;">
              <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userDoc.username},</p>
              <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
                The status of your vehicle sale submission for <b>${updated.title}</b> has been updated to <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${status.charAt(0).toUpperCase() + status.slice(1)}</span>.
                <br/><br/>
                ${status === 'pending' ? `
                  We have received your vehicle sale request and it is currently <b>pending</b> review. Our team will verify your details and contact you soon with the next steps.<br/>
                  If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                  <br/>
                  Thank you for choosing <b>SKMT Finance</b> to assist with your vehicle sale!
                ` : status === 'approved' ? `
                  Good news! Your vehicle sale submission has been <b>approved</b>. Our team will reach out to you shortly to guide you through the next steps and finalize the process.<br/>
                  If you have any questions or need further assistance, please let us know.<br/>
                  <br/>
                  We appreciate your trust in <b>SKMT Finance</b> and look forward to a successful sale!
                ` : status === 'rejected' ? `
                  We regret to inform you that your vehicle sale submission has been <b>rejected</b>. If you believe this is a mistake or need more information, please contact our support team.<br/>
                  <br/>
                  Thank you for considering <b>SKMT Finance</b> for your vehicle sale needs.
                ` : `
                  If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                  <br/>
                  Thank you for choosing <b>SKMT Finance</b>!
                `}
              </p>
              <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
                <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Vehicle Sale Details</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                  <li><b>Vehicle:</b> ${updated.title}</li>
                  <li><b>Brand:</b> ${updated.brand}</li>
                  <li><b>Year:</b> ${updated.year}</li>
                  <li><b>Fuel:</b> ${updated.fuel}</li>
                  <li><b>Transmission:</b> ${updated.transmission}</li>
                  <li><b>Kilometers Driven:</b> ${updated.kmDriven}</li>
                  <li><b>Owners:</b> ${updated.owners}</li>
                  <li><b>Price:</b> ₹${updated.price}</li>
                  <li><b>Description:</b> ${updated.description}</li>
                  <li><b>Name:</b> ${userDoc.username}</li>
                  <li><b>Email:</b> ${userDoc.email}</li>
                  <li><b>Phone:</b> ${userDoc.phone}</li>
                  ${updated.images && updated.images.length > 0 ? `<li style="margin-top: 12px;"><img src="${updated.images[0]}" alt="Vehicle Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
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
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get vehicle sales by user
exports.getVehicleSalesByUser = async (req, res) => {
  try {
    const sales = await VehicleSale.find({ user: req.params.userId });
    res.json({ success: true, data: sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Delete a vehicle sale
exports.deleteVehicleSale = async (req, res) => {
  try {
    const deleted = await VehicleSale.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Vehicle sale deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}; 