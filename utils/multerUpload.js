const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookClub/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    public_id: (req, file) => {
      const randomNumber = Math.floor(Math.random() * 10000);
      const sanitizedFilename = req.body.name ? req.body.name.replace(/\s+/g, '-') : 'product';
      return `${sanitizedFilename}-${randomNumber}-${Date.now()}`;
    }
  }
});

// Cloudinary storage for category images
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookClub/categories',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
    public_id: (req, file) => {
      return `category-${Date.now()}-${file.originalname.split('.')[0]}`;
    }
  }
});

// Cloudinary storage for user profile images
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookClub/users',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    public_id: (req, file) => {
      return `user-${Date.now()}-${file.originalname.split('.')[0]}`;
    }
  }
});

// File filter for additional validation
function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (png, jpg, jpeg, webp) are allowed!'), false);
  }
}

// Multer instances with Cloudinary storage
const upload = multer({ storage: productStorage, fileFilter });
const catImg = multer({ storage: categoryStorage, fileFilter });
const uploadUser = multer({ storage: userStorage, fileFilter });

module.exports = { upload, uploadUser, catImg, cloudinary };
