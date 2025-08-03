import express from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload image route (protected)
router.post('/image', authMiddleware, uploadMiddleware, uploadImage);

export default router;
