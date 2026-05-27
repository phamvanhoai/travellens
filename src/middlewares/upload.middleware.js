const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const mapUploadDir = path.join(__dirname, '..', '..', 'public', 'maps');
const reviewUploadDir = path.join(__dirname, '..', '..', 'public', 'reviews');
const allowedMapExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const allowedMapMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);
const allowedReviewPhotoExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const allowedReviewPhotoMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

fs.mkdirSync(mapUploadDir, { recursive: true });
fs.mkdirSync(reviewUploadDir, { recursive: true });

const createStorage = (uploadDir, fallbackName) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const safeName = baseName || fallbackName;

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const mapStorage = createStorage(mapUploadDir, 'map');
const reviewPhotoStorage = createStorage(reviewUploadDir, 'review-photo');

const mapFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMapExtensions.has(ext) || !allowedMapMimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Unsupported map file format'));
    return;
  }

  cb(null, true);
};

const reviewPhotoFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedReviewPhotoExtensions.has(ext) || !allowedReviewPhotoMimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Unsupported review photo format'));
    return;
  }

  cb(null, true);
};

const uploadMap = multer({
  storage: mapStorage,
  fileFilter: mapFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadReviewPhotos = multer({
  storage: reviewPhotoStorage,
  fileFilter: reviewPhotoFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

const handleMapUpload = (req, res, next) => {
  uploadMap.single('map_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.map_file = `/public/maps/${req.file.filename}`;
      }
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      next(new ApiError(httpStatus.BAD_REQUEST, error.message));
      return;
    }

    next(error);
  });
};

const handleReviewPhotoUpload = (req, res, next) => {
  uploadReviewPhotos.array('photos', 5)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const statusCode = error.code === 'LIMIT_FILE_SIZE'
        ? httpStatus.PAYLOAD_TOO_LARGE
        : httpStatus.BAD_REQUEST;
      next(new ApiError(statusCode, error.message));
      return;
    }

    next(error);
  });
};

module.exports = {
  handleMapUpload,
  handleReviewPhotoUpload,
};
