const multer = require('multer');
const path = require('path');

// Storage configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs/productImgs');
  },

filename: function (req, file, cb) {
    const randomNumber = Math.floor(Math.random() * 10000); // Adding a random number
    const sanitizedFilename = JSON.stringify(req.body.name).replace(/\s+/g, '-'); // Replace whitespaces with hyphens
    const fileName = `${sanitizedFilename}-${randomNumber}`; // No original filename
    cb(null, fileName);
  }
});

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs/categoryImg');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  }
});

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/imgs/usr');
  },
  
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  }
});

// File filter
function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

// Multer instances
const upload = multer({ storage, fileFilter });
const catImg = multer({ storage: categoryStorage, fileFilter });
const uploadUser = multer({ storage: userStorage, fileFilter });

module.exports = { upload, uploadUser, catImg };
