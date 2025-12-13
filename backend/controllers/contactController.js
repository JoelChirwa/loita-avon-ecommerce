import nodemailer from 'nodemailer';
import ContactMessage from '../models/ContactMessage.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email styles
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
    .info-box {
      background: #f9fafb;
      border-left: 4px solid #ec4899;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-row {
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .info-value {
      color: #111827;
    }
    .message-box {
      background: #fef3c7;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
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
  </style>
`;

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save message to database first
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || undefined,
      subject,
      message
    });

    // Try to send email if configured, but don't fail if email isn't set up
    const emailConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (emailConfigured) {

      try {
        const transporter = createTransporter();
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

        // Subject type labels
    const subjectLabels = {
      product: 'Product Inquiry',
      order: 'Order Status',
      partnership: 'Business Partnership',
      complaint: 'Complaint',
      other: 'Other'
    };

    const subjectLabel = subjectLabels[subject] || subject;

    // Email to admin
    const adminHtmlContent = `
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
            <h1>📬 New Contact Form Submission</h1>
          </div>
          <div class="email-body">
            <p>You have received a new message from the Loita Shop contact form.</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value"><a href="mailto:${email}" style="color: #ec4899;">${email}</a></div>
              </div>
              ${phone ? `
              <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${phone}</div>
              </div>
              ` : ''}
              <div class="info-row">
                <div class="info-label">Subject:</div>
                <div class="info-value">${subjectLabel}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Submitted:</div>
                <div class="info-value">${new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
            </div>

            <div class="message-box">
              <strong>Message:</strong><br><br>
              ${message.replace(/\n/g, '<br>')}
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              💡 <strong>Tip:</strong> Reply directly to <a href="mailto:${email}" style="color: #ec4899;">${email}</a> to respond to this inquiry.
            </p>
          </div>
          <div class="email-footer">
            <p><strong>Loita Shop</strong> Admin Notification</p>
            <p style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} Loita Shop. All rights reserved.<br>
              Built with ❤️ by Joel Chirwa
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Confirmation email to user
    const userHtmlContent = `
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
            <h1>✅ Message Received</h1>
          </div>
          <div class="email-body">
            <p>Hi <strong>${name}</strong>,</p>
            
            <p>Thank you for contacting Loita Shop! We've received your message and will get back to you as soon as possible.</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Subject:</div>
                <div class="info-value">${subjectLabel}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Your Message:</div>
                <div class="info-value" style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>

            <div class="message-box">
              <strong>⏰ What's Next?</strong><br>
              Our team typically responds within 24 hours during business hours (Mon-Sat, 8AM-6PM). 
              For urgent matters, please call us at +265 xxx xxx xxx.
            </div>

            <p>In the meantime, feel free to:</p>
            <ul style="line-height: 2;">
              <li>Browse our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" style="color: #ec4899;">product catalog</a></li>
              <li>Check your <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" style="color: #ec4899;">order status</a></li>
              <li>Visit our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/about" style="color: #ec4899;">about page</a></li>
            </ul>

            <p>Best regards,<br>
            <strong>The Loita Shop Team</strong></p>
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

        // Send email to admin
        await transporter.sendMail({
          from: `"Loita Shop Contact Form" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          replyTo: email,
          subject: `New Contact Form: ${subjectLabel} - ${name}`,
          html: adminHtmlContent,
        });

        // Send confirmation email to user
        await transporter.sendMail({
          from: `"Loita Shop" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Thank you for contacting Loita Shop',
          html: userHtmlContent,
        });

        console.log(`Contact form emails sent for: ${email}`);
      } catch (emailError) {
        console.error('Email sending failed (message still saved):', emailError.message);
      }
    }

    res.json({
      success: true,
      message: 'Your message has been received! We\'ll get back to you soon.',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update contact message status (Admin)
// @route   PATCH /api/contact/:id
// @access  Private/Admin
export const updateContactMessage = async (req, res) => {
  try {
    const { status, reply } = req.body;

    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (status) message.status = status;
    if (reply) {
      message.reply = reply;
      message.repliedAt = Date.now();
    }

    await message.save();

    res.json({
      success: true,
      message: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
