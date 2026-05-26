const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const mapUploadDir = path.join(__dirname, '..', '..', 'public', 'maps');
const allowedMapExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const allowedMapMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);

fs.mkdirSync(mapUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mapUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const safeName = baseName || 'map';

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

const mapFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMapExtensions.has(ext) || !allowedMapMimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Unsupported map file format'));
    return;
  }

  cb(null, true);
};

const uploadMap = multer({
  storage,
  fileFilter: mapFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
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

module.exports = {
  handleMapUpload,
};
