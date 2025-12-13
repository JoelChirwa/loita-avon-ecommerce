import axios from 'axios';
import Order from '../models/Order.js';

const PAYCHANGU_API_URL = 'https://api.paychangu.com/payment';

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    // Generate unique transaction reference
    const tx_ref = `ORDER-${orderId}-${Date.now()}`;

    // Prepare payment data
    const paymentData = {
      amount: order.totalPrice,
      currency: 'MWK',
      email: req.user.email,
      first_name: req.user.name.split(' ')[0],
      last_name: req.user.name.split(' ')[1] || req.user.name.split(' ')[0],
      callback_url: process.env.PAYCHANGU_CALLBACK_URL || 'http://localhost:5000/api/payments/callback',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${orderId}`,
      tx_ref: tx_ref,
      title: `Order #${order.orderNumber}`,
      description: `Payment for order ${order.orderNumber}`,
      logo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/logo.png`,
      customization: {
        title: 'Loita Shop',
        description: `Payment for order ${order.orderNumber}`
      }
    };

    // Add phone number if payment method is mobile money
    if (order.paymentMethod === 'airtel-money' || order.paymentMethod === 'mpamba') {
      paymentData.phone = phone;
    }

    // Make request to PayChangu
    const response = await axios.post(PAYCHANGU_API_URL, paymentData, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Store payment reference in order
    order.paymentResult = {
      id: response.data.data.tx_ref,
      status: 'pending',
      updateTime: new Date(),
    };
    await order.save();

    res.json({
      success: true,
      paymentUrl: response.data.data.checkout_url,
      txRef: response.data.data.tx_ref,
    });
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to initiate payment',
    });
  }
};

// @desc    Handle payment callback
// @route   POST /api/payments/callback
// @access  Public (called by PayChangu)
export const paymentCallback = async (req, res) => {
  try {
    const { tx_ref, status, transaction_id } = req.body;

    console.log('Payment callback received:', req.body);

    // Find order by transaction reference
    const order = await Order.findOne({ 'paymentResult.id': tx_ref });

    if (!order) {
      console.error('Order not found for tx_ref:', tx_ref);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order payment status
    order.paymentResult = {
      id: tx_ref,
      status: status,
      updateTime: new Date(),
      transactionId: transaction_id,
    };

    if (status === 'success' || status === 'successful') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'processing';
    } else if (status === 'failed') {
      order.status = 'pending';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment callback processed'
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment callback'
    });
  }
};

// @desc    Verify payment status
// @route   GET /api/payments/verify/:txRef
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { txRef } = req.params;

    // Verify payment with PayChangu
    const response = await axios.get(`${PAYCHANGU_API_URL}/verify/${txRef}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
      },
    });

    const order = await Order.findOne({ 'paymentResult.id': txRef });

    if (order && response.data.data.status === 'successful') {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'processing';
      order.paymentResult.status = 'successful';
      order.paymentResult.transactionId = response.data.data.transaction_id;
      await order.save();
    }

    res.json({
      success: true,
      paymentStatus: response.data.data.status,
      order: order,
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
};
