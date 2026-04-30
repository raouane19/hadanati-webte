const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = [
        './uploads',
        './uploads/profiles',
        './uploads/daycares',
        './uploads/children'
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadDirs();

// Configure storage for profile images
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = './uploads/profiles';
        
        if (req.baseUrl.includes('daycares')) {
            folder = './uploads/daycares';
        } else if (req.baseUrl.includes('parents')) {
            folder = './uploads/profiles';
        } else if (req.baseUrl.includes('children')) {
            folder = './uploads/children';
        }
        
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
    }
};

// Configure multer for single file upload
const uploadSingle = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
}).single('image');

// Middleware wrapper for error handling
const uploadProfileImage = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'File too large. Max size is 5MB.' 
                });
            }
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }
        next();
    });
};

// Delete old image file
const deleteOldImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
        });
    }
};

// Get image URL from filename
const getImageUrl = (filename, req) => {
    if (!filename) return null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${filename}`;
};

module.exports = {
    uploadProfileImage,
    deleteOldImage,
    getImageUrl
};