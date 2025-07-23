const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userSnapshot, productSnapshot } = req.body;
    // Always fetch the full product from DB using the ID
    let fullProduct = null;
    try {
      fullProduct = await Product.findById(
        productSnapshot._id || productSnapshot
      );
    } catch (err) {
      fullProduct = null;
    }
    if (!fullProduct) {
      return res.status(400).json({ success: false, error: 'Product not found' });
    }
    const snapshotToUse = {
      _id: String(fullProduct._id),
      name: fullProduct.name,
      price: fullProduct.price,
      type: fullProduct.type,
      modelYear: fullProduct.modelYear,
      owners: fullProduct.owners,
      fc: fullProduct.fc,
      fcDuration: fullProduct.fcDuration,
      fcUnit: fullProduct.fcUnit,
      insurance: fullProduct.insurance,
      insuranceDuration: fullProduct.insuranceDuration,
      insuranceUnit: fullProduct.insuranceUnit,
      images: fullProduct.images,
      description: fullProduct.description,
    };
    if (!userSnapshot || !snapshotToUse || !snapshotToUse._id) {
      return res.status(400).json({ success: false, error: 'User and product details are required' });
    }
    const order = new Order({ userSnapshot, productSnapshot: snapshotToUse });
    await order.save();

    // Send order confirmation email (same as before)
    const prodName = snapshotToUse.name || '-';
    const prodType = snapshotToUse.type || '-';
    const prodPrice = snapshotToUse.price ? Number(snapshotToUse.price).toLocaleString() : '-';
    const prodImages = Array.isArray(snapshotToUse.images) ? snapshotToUse.images : [];
    const modelYear = snapshotToUse.modelYear || '-';
    const owners = snapshotToUse.owners || '-';
    const fc = snapshotToUse.fc ? 'Yes' : 'No';
    const fcDuration = snapshotToUse.fcDuration || '-';
    const fcUnit = snapshotToUse.fcUnit || '-';
    const insurance = snapshotToUse.insurance ? 'Yes' : 'No';
    const insuranceDuration = snapshotToUse.insuranceDuration || '-';
    const insuranceUnit = snapshotToUse.insuranceUnit || '-';
    const description = snapshotToUse.description || '-';
    await sendEmail({
      to: userSnapshot.email,
      subject: 'Booking Confirmation - ' + prodName,
      html: `
      <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
            <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
            <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Booking Successfully!</h2>
          </div>
          <div style="padding: 32px 28px 18px 28px;">
            <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${userSnapshot.username},</p>
            <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
              Thank you for your Booking! Your request for <b>${prodName}</b> has been received and is being processed. Our team will contact you soon with further details.<br/><br/>
              We value your trust in <b>SKMT Finance</b> and are committed to providing you with a smooth and transparent experience.<br/>
              If you have any questions or need assistance at any stage, please feel free to reply to this email or contact our support team.<br/>
              <br/>
              We look forward to serving you and helping you fulfill your needs!
            </p>
            <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Booking Details</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                <li><b>Product:</b> ${prodName}</li>
                <li><b>Type:</b> ${prodType}</li>
                <li><b>Price:</b> ₹${prodPrice}</li>
                <li><b>Model Year:</b> ${modelYear}</li>
                <li><b>Owners:</b> ${owners}</li>
                <li><b>FC:</b> ${fc}</li>
                <li><b>FC Duration:</b> ${fcDuration} ${fcUnit}</li>
                <li><b>Insurance:</b> ${insurance}</li>
                <li><b>Insurance Duration:</b> ${insuranceDuration} ${insuranceUnit}</li>
                <li><b>Description:</b> ${description}</li>
                <li><b>Order Date:</b> ${new Date(order.orderDate).toLocaleString()}</li>
                <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:#f59e42;color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">Pending</span></li>
                <li><b>Name:</b> ${userSnapshot.username}</li>
                <li><b>Email:</b> ${userSnapshot.email}</li>
                <li><b>Phone:</b> ${userSnapshot.phone}</li>
                ${prodImages.length > 0 ? `<li style="margin-top: 12px;"><img src="${prodImages[0]}" alt="Product Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
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

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderstatus: status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Order not found' });

    // Fetch the full order document to ensure all fields are present
    const fullOrder = await Order.findById(updated._id);
    // console.log('DEBUG: fullOrder in status update:', fullOrder);
    // Use the same product details logic as createOrder
    let product = fullOrder && fullOrder.productSnapshot ? fullOrder.productSnapshot : {};
    // If productSnapshot is incomplete, fetch the full product and build a complete snapshot, and update the order in DB
    const importantFields = ['name', 'price', 'type', 'modelYear', 'owners', 'fc', 'fcDuration', 'fcUnit', 'insurance', 'insuranceDuration', 'insuranceUnit', 'images', 'description'];
    const isIncomplete = !product || importantFields.some(field => product[field] === undefined);

    if (isIncomplete) {
      let fullProduct = null;
      try {
        fullProduct = await Product.findById(product._id || product);
      } catch (err) {
        fullProduct = null;
      }
      if (fullProduct) {
        product = {
          _id: String(fullProduct._id),
          name: fullProduct.name,
          price: fullProduct.price,
          type: fullProduct.type,
          modelYear: fullProduct.modelYear,
          owners: fullProduct.owners,
          fc: fullProduct.fc,
          fcDuration: fullProduct.fcDuration,
          fcUnit: fullProduct.fcUnit,
          insurance: fullProduct.insurance,
          insuranceDuration: fullProduct.insuranceDuration,
          insuranceUnit: fullProduct.insuranceUnit,
          images: fullProduct.images,
          description: fullProduct.description,
        };
        // Update the order document in DB with the full snapshot for future status updates
        await Order.findByIdAndUpdate(fullOrder._id, { productSnapshot: product });
      } else {
        product = {};
      }
    }
    // console.log('DEBUG: productSnapshot used in status update email:', product);
    const prodName = product.name || '-';
    const prodType = product.type || '-';
    const prodPrice = product.price ? Number(product.price).toLocaleString() : '-';
    const prodImages = Array.isArray(product.images) ? product.images : [];
    const modelYear = product.modelYear || '-';
    const owners = product.owners || '-';
    const fc = product.fc ? 'Yes' : 'No';
    const fcDuration = product.fcDuration || '-';
    const fcUnit = product.fcUnit || '-';
    const insurance = product.insurance ? 'Yes' : 'No';
    const insuranceDuration = product.insuranceDuration || '-';
    const insuranceUnit = product.insuranceUnit || '-';
    const description = product.description || '-';
    const orderDate = fullOrder && fullOrder.orderDate ? new Date(fullOrder.orderDate).toLocaleString() : '-';
    const statusColors = {
      Pending: '#f97316',
      Processing: '#3b82f6',
      Completed: '#10b981',
      Cancelled: '#ef4444',
    };
    const badgeColor = statusColors[status] || '#f97316';
    await sendEmail({
      to: updated.userSnapshot.email,
      subject: `Booking Status Update - ${prodName} | SKMT Finance`,
      html: `
      <div style="background: #f4f8fb; padding: 32px 0; font-family: 'Segoe UI', Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(30,58,138,0.10); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%); padding: 32px 0 18px 0; text-align: center;">
            <img src="https://res.cloudinary.com/dipgt9ow3/image/upload/v1753209298/skmt_uploads/skmt_logo_1_t9yd5o.png" alt="SKMT Logo" style="height: 48px; margin-bottom: 10px; border-radius: 8px; background: #f4f8fb;" />
            <h2 style="color: #fff; margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: 1px;">Booking Status Updated!</h2>
          </div>
          <div style="padding: 32px 28px 18px 28px;">
            <p style="font-size: 1.1rem; color: #1e3a8a; font-weight: 600; margin-bottom: 6px;">Hi ${updated.userSnapshot.username},</p>
            <p style="font-size: 1.05rem; color: #222; margin-bottom: 0;">
              The status of your order for <b>${prodName}</b> has been updated to 
              <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${status}</span>.
              <br/><br/>
              ${status === 'Pending' ? `
                We have received your order and it is currently <b>pending</b> review. Our team will contact you soon with further details.<br/>
                If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                Thank you for choosing <b>SKMT Finance</b>!
              ` : status === 'Processing' ? `
                Your order is now <b>being processed</b> by our team. We are working diligently to complete your request as soon as possible.<br/>
                If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                Thank you for your patience and for choosing <b>SKMT Finance</b>!
              ` : status === 'Completed' ? `
                Congratulations! Your order has been <b>completed</b> successfully. We hope you are satisfied with our service.<br/>
                If you have any feedback or further questions, please let us know.<br/>
                <br/>
                Thank you for trusting <b>SKMT Finance</b>!
              ` : status === 'Cancelled' ? `
                We regret to inform you that your order has been <b>cancelled</b>. If you believe this is a mistake or need more information, please contact our support team.<br/>
                <br/>
                Thank you for considering <b>SKMT Finance</b>.
              ` : `
                If you have any questions or need assistance, please feel free to reply to this email or contact our support team.<br/>
                <br/>
                Thank you for choosing <b>SKMT Finance</b>!
              `}
            </p>
            <div style="background: #f9fafb; border-radius: 12px; box-shadow: 0 2px 8px rgba(30,58,138,0.06); padding: 20px 18px 10px 18px; margin-top: 18px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e3a8a; margin-bottom: 10px; font-size: 1.1rem; font-weight: 700;">Booking Details</h4>
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 1rem; color: #333;">
                <li><b>Product:</b> ${prodName}</li>
                <li><b>Type:</b> ${prodType}</li>
                <li><b>Price:</b> ₹${prodPrice}</li>
                <li><b>Model Year:</b> ${modelYear}</li>
                <li><b>Owners:</b> ${owners}</li>
                <li><b>FC:</b> ${fc}</li>
                <li><b>FC Duration:</b> ${fcDuration} ${fcUnit}</li>
                <li><b>Insurance:</b> ${insurance}</li>
                <li><b>Insurance Duration:</b> ${insuranceDuration} ${insuranceUnit}</li>
                <li><b>Description:</b> ${description}</li>
                <li><b>Order Date:</b> ${orderDate}</li>
                <li><b>Status:</b> <span style="display:inline-block;padding:2px 12px;border-radius:8px;background:${badgeColor};color:#fff;font-weight:600;font-size:0.98rem;letter-spacing:0.5px;">${status}</span></li>
                <li><b>Name:</b> ${updated.userSnapshot.username}</li>
                <li><b>Email:</b> ${updated.userSnapshot.email}</li>
                <li><b>Phone:</b> ${updated.userSnapshot.phone}</li>
                ${prodImages.length > 0 ? `<li style="margin-top: 12px;"><img src="${prodImages[0]}" alt="Product Image" style="max-width: 180px; border-radius: 8px; border: 1.5px solid #c7d2fe;" /></li>` : ''}
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

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).limit(10);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
}; 