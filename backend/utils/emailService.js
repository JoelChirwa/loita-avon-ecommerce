import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Base email styles
const getEmailStyles = () => `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .email-body {
      padding: 30px;
    }
    .order-details {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-details h2 {
      margin-top: 0;
      color: #ec4899;
      font-size: 20px;
    }
    .order-item {
      border-bottom: 1px solid #e5e7eb;
      padding: 15px 0;
      display: flex;
      justify-content: space-between;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .order-summary {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #ec4899;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .summary-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #ec4899;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .btn:hover {
      background: linear-gradient(135deg, #be185d 0%, #9d174d 100%);
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-processing { background: #dbeafe; color: #1e40af; }
    .status-shipped { background: #e0e7ff; color: #4338ca; }
    .status-delivered { background: #d1fae5; color: #065f46; }
    .status-cancelled { background: #fee2e2; color: #991b1b; }
    .email-footer {
      background: #111827;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .email-footer a {
      color: #ec4899;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 20px 0;
    }
    .info-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .success-box {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
`;

// Order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured');
      return;
    }

    const transporter = createTransporter();

    const orderItemsHtml = order.items.map(item => `
      <div class="order-item">
        <div>
          <strong>${item.name}</strong><br>
          <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
        </div>
        <div style="text-align: right;">
          <strong>MWK ${item.price.toLocaleString()}</strong>
        </div>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>🎉 Order Confirmed!</h1>
          </div>
          <div class="email-body">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for your order! We're excited to get your Avon products to you.</p>
            
            <div class="success-box">
              <strong>Order Number:</strong> #${order.orderNumber}<br>
              <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}<br>
              <strong>Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </div>

            <div class="order-details">
              <h2>Order Details</h2>
              ${orderItemsHtml}
              
              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>MWK ${order.subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping:</span>
                  <span>MWK ${order.shippingCost.toLocaleString()}</span>
                </div>
                ${order.discount > 0 ? `
                <div class="summary-row">
                  <span>Discount:</span>
                  <span style="color: #10b981;">-MWK ${order.discount.toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="summary-row total">
                  <span>Total:</span>
                  <span>MWK ${order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="order-details">
              <h2>Shipping Address</h2>
              <p style="margin: 0;">
                ${order.shippingAddress.name}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.region}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <div class="info-box">
              <strong>📦 What's Next?</strong><br>
              We'll send you another email when your order ships. You can track your order status anytime.
            </div>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}" class="btn">
                View Order Details
              </a>
            </center>

            <p>If you have any questions, feel free to contact us at 
              <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}" style="color: #ec4899;">
                ${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}
              </a>
            </p>
          </div>
          <div class="email-footer">
            <p><strong>Loita Shop</strong> - Your trusted Avon partner in Malawi</p>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products">Shop</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/about">About</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact">Contact</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} Loita Shop. All rights reserved.<br>
              Built with ❤️ by Joel Chirwa
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Loita Shop" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: htmlContent,
    });

    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

// Order status update email
export const sendOrderStatusEmail = async (order, user, oldStatus) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured');
      return;
    }

    const transporter = createTransporter();

    const statusMessages = {
      Processing: {
        title: '⚙️ Order Processing',
        message: "We're preparing your order for shipment. It will be on its way soon!",
        boxClass: 'info-box'
      },
      Shipped: {
        title: '🚚 Order Shipped',
        message: "Great news! Your order is on its way to you. You should receive it within 2-5 business days.",
        boxClass: 'success-box'
      },
      Delivered: {
        title: '✅ Order Delivered',
        message: "Your order has been delivered! We hope you love your Avon products.",
        boxClass: 'success-box'
      },
      Cancelled: {
        title: '❌ Order Cancelled',
        message: "Your order has been cancelled. If you didn't request this, please contact us immediately.",
        boxClass: 'info-box'
      }
    };

    const statusInfo = statusMessages[order.status] || {
      title: '📦 Order Update',
      message: `Your order status has been updated to: ${order.status}`,
      boxClass: 'info-box'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>${statusInfo.title}</h1>
          </div>
          <div class="email-body">
            <p>Hi <strong>${user.name}</strong>,</p>
            
            <div class="${statusInfo.boxClass}">
              ${statusInfo.message}
            </div>

            <div class="order-details">
              <h2>Order Information</h2>
              <p>
                <strong>Order Number:</strong> #${order.orderNumber}<br>
                <strong>Previous Status:</strong> <span class="status-badge status-${oldStatus.toLowerCase()}">${oldStatus}</span><br>
                <strong>Current Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span><br>
                <strong>Total Amount:</strong> MWK ${order.totalAmount.toLocaleString()}
              </p>
            </div>

            ${order.trackingNumber ? `
            <div class="info-box">
              <strong>📍 Tracking Number:</strong> ${order.trackingNumber}
            </div>
            ` : ''}

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order._id}" class="btn">
                Track Your Order
              </a>
            </center>

            <p>Questions? Contact us at 
              <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}" style="color: #ec4899;">
                ${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}
              </a>
            </p>
          </div>
          <div class="email-footer">
            <p><strong>Loita Shop</strong> - Your trusted Avon partner in Malawi</p>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products">Shop</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders">My Orders</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact">Contact</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} Loita Shop. All rights reserved.<br>
              Built with ❤️ by Joel Chirwa
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Loita Shop" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Order Update - #${order.orderNumber}`,
      html: htmlContent,
    });

    console.log(`Order status email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order status email:', error);
  }
};

// Welcome email for new users
export const sendWelcomeEmail = async (user) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email service not configured');
      return;
    }

    const transporter = createTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${getEmailStyles()}
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>👋 Welcome to Loita Shop!</h1>
          </div>
          <div class="email-body">
            <p>Hi <strong>${user.name}</strong>,</p>
            
            <p>Welcome to Loita Shop - your trusted destination for authentic Avon products in Malawi!</p>
            
            <div class="success-box">
              <strong>🎉 Your account is ready!</strong><br>
              Start shopping for quality beauty and wellness products delivered right to your doorstep.
            </div>

            <h3>What You Can Do:</h3>
            <ul style="line-height: 2;">
              <li>✨ Browse our full collection of Avon products</li>
              <li>💝 Add items to your wishlist</li>
              <li>🛒 Enjoy secure checkout with multiple payment options</li>
              <li>📦 Track your orders in real-time</li>
              <li>⭐ Leave reviews and earn rewards</li>
            </ul>

            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" class="btn">
                Start Shopping
              </a>
            </center>

            <div class="divider"></div>

            <p><strong>Need help?</strong><br>
            Our support team is here for you. Contact us at 
              <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}" style="color: #ec4899;">
                ${process.env.SUPPORT_EMAIL || 'support@loitashop.com'}
              </a>
            </p>
          </div>
          <div class="email-footer">
            <p><strong>Loita Shop</strong> - Your trusted Avon partner in Malawi</p>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products">Shop</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/about">About</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact">Contact</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} Loita Shop. All rights reserved.<br>
              Built with ❤️ by Joel Chirwa
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Loita Shop" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to Loita Shop! 🎉',
      html: htmlContent,
    });

    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export default {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendWelcomeEmail
};
