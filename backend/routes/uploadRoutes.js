import express from 'express';
import { uploadProductImages, deleteImage } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload product images
router.post('/products', protect, admin, upload.array('images', 5), uploadProductImages);

// Delete image
router.delete('/:publicId', protect, admin, deleteImage);

export default router;
