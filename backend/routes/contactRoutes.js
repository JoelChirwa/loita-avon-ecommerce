import express from 'express';
import { submitContactForm, getContactMessages, updateContactMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route - no authentication required
router.post('/', submitContactForm);

// Admin routes
router.get('/', protect, admin, getContactMessages);
router.patch('/:id', protect, admin, updateContactMessage);

export default router;
