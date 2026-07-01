const multer = require('multer');
const path = require('path');

// Use memory storage for Cloudinary streaming
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|gif|webp|svg/;
  const allowedDocs = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype;

  const isImage = allowedImages.test(ext) && (mime.startsWith('image/') || mime === 'image/svg+xml');
  const isPDF = allowedDocs.test(ext) && (mime === 'application/pdf' || mime.includes('document'));

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WebP, SVG) and documents (PDF, DOC) are allowed'), false);
  }
};

// Image upload (max 10MB)
const uploadImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

// Multiple screenshots (max 8 files, 10MB each)
const uploadScreenshots = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 8 },
  fileFilter,
});

// Document upload for resume/contact attachments (max 5MB)
const uploadDoc = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = { uploadImage, uploadScreenshots, uploadDoc };
