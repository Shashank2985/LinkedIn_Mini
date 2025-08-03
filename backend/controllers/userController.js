import User from '../models/User.js';
import Post from '../models/Post.js';

// Get user profile by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Background image upload error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile by username
export const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Background image upload error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update own profile
export const updateProfile = async (req, res) => {
    try {
        const updates = (({ name, bio }) => ({ name, bio }))(req.body);
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Background image upload error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update profile image
export const updateProfileImage = async (req, res) => {
    try {
        console.log('🚀 Profile image upload started for user:', req.user.id);
        
        if (!req.file) {
            console.error('❌ No image file provided in request');
            return res.status(400).json({ message: 'No image file provided' });
        }

        console.log('📁 File received:', {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        });

        // Get the Cloudinary URL from the uploaded file
        const cloudinaryUrl = req.file.path; // This is the Cloudinary secure URL
        
        if (!cloudinaryUrl) {
            console.error('❌ No Cloudinary URL found in uploaded file');
            return res.status(500).json({ message: 'Failed to get image URL from Cloudinary' });
        }

        console.log('🖼️ Cloudinary URL obtained:', cloudinaryUrl);

        // Update user's profile image in database
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profileImage: cloudinaryUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            console.error('❌ User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ Profile image updated successfully in database:', {
            userId: user._id,
            profileImage: user.profileImage
        });

        res.json({ 
            message: 'Profile image updated successfully', 
            user: user,
            cloudinaryUrl: cloudinaryUrl
        });
    } catch (err) {
        console.error('❌ Profile image upload error:', {
            error: err.message,
            stack: err.stack,
            userId: req.user?.id
        });
        res.status(500).json({ 
            message: 'Server error during profile image upload',
            error: err.message 
        });
    }
};

// Update background image
export const updateBackgroundImage = async (req, res) => {
    try {
        console.log('🚀 Background image upload started for user:', req.user.id);
        
        if (!req.file) {
            console.error('❌ No image file provided in request');
            return res.status(400).json({ message: 'No image file provided' });
        }

        console.log('📁 File received:', {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        });

        // Get the Cloudinary URL from the uploaded file
        const cloudinaryUrl = req.file.path; // This is the Cloudinary secure URL
        
        if (!cloudinaryUrl) {
            console.error('❌ No Cloudinary URL found in uploaded file');
            return res.status(500).json({ message: 'Failed to get image URL from Cloudinary' });
        }

        console.log('🖼️ Cloudinary URL obtained:', cloudinaryUrl);

        // Update user's background image in database
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { backgroundImage: cloudinaryUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            console.error('❌ User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ Background image updated successfully in database:', {
            userId: user._id,
            backgroundImage: user.backgroundImage
        });

        res.json({ 
            message: 'Background image updated successfully', 
            user: user,
            cloudinaryUrl: cloudinaryUrl
        });
    } catch (err) {
        console.error('❌ Background image upload error:', {
            error: err.message,
            stack: err.stack,
            userId: req.user?.id
        });
        res.status(500).json({ 
            message: 'Server error during background image upload',
            error: err.message 
        });
    }
};

// Get all posts by user
export const getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const posts = await Post.find({ author: req.params.id }).populate('author', 'name').sort({ createdAt: -1 });
        
        res.json({ user, posts });
    } catch (err) {
        console.error('Background image upload error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
