import express from 'express';
import { body } from 'express-validator';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
];

router.post('/:productId', protect, reviewValidation, createReview);
router.get('/:productId', getProductReviews);
router.put('/:id', protect, reviewValidation, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
