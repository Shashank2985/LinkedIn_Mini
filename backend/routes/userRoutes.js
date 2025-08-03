import express from 'express';
import { getUserById, getUserByUsername, updateProfile, getUserPosts, updateProfileImage, updateBackgroundImage } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Get user profile by ID
router.get('/:id', getUserById);
// Get user profile by username
router.get('/username/:username', getUserByUsername);
// Update own profile
router.put('/me', authMiddleware, updateProfile);
// Update profile image
router.put('/me/profile-image', authMiddleware, upload.single('profileImage'), updateProfileImage);
// Update background image
router.put('/me/background-image', authMiddleware, upload.single('backgroundImage'), updateBackgroundImage);
// Get all posts by user
router.get('/:id/posts', getUserPosts);

export default router;
