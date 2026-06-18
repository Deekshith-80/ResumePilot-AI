const multer = require('multer');
const path = require('path');
const env = require('../config/env');
const AppError = require('../utils/AppError');

const maxFileSize = env.maxFileSizeMb * 1024 * 1024;

const fileFilter = (allowedMimeTypes, allowedExtensions) => (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
    cb(null, true);
    return;
  }

  cb(new AppError('Unsupported file type.', 400), false);
};

const memoryStorage = multer.memoryStorage();

const resumeUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: maxFileSize },
  fileFilter: fileFilter(
    ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['.pdf', '.docx']
  )
});

const avatarUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(['image/png', 'image/jpeg', 'image/jpg', 'image/webp'], ['.png', '.jpg', '.jpeg', '.webp'])
});

module.exports = {
  resumeUpload,
  avatarUpload
};

