import express from 'express';
import {
  subscribeToPush,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/subscribe', protect, subscribeToPush);
router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

// Admin routes
router.post('/send', protect, admin, sendNotification);

export default router;
