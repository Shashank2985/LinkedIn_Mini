import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary directly
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dks9w3iah',
    api_key: process.env.CLOUDINARY_API_KEY || '226468341979722',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'IzsjAYPjo6LqXIktiSgZGUhQip8',
});

console.log('Cloudinary configured with:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key ? 'Set' : 'Missing',
    api_secret: cloudinary.config().api_secret ? 'Set' : 'Missing'
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mini-linkedin', // folder name in cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        resource_type: 'image',
        transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Resize images
            { quality: 'auto' } // Auto optimize quality
        ]
    },
});

// Configure multer with cloudinary storage
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

export default cloudinary;
