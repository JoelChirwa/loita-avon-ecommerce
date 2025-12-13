import express from 'express';
import { 
  initiatePayment, 
  paymentCallback, 
  verifyPayment 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initiate payment
router.post('/initiate', protect, initiatePayment);

// Payment callback (public - called by PayChangu)
router.post('/callback', paymentCallback);

// Verify payment
router.get('/verify/:txRef', protect, verifyPayment);

export default router;
