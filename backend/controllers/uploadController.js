import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'mini-linkedin/posts',
            resource_type: 'auto',
        });

        res.json({
            success: true,
            imageUrl: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ 
            message: 'Failed to upload image',
            error: error.message 
        });
    }
};

// Multer middleware
export const uploadMiddleware = upload.single('image');
