const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const isVercel = Boolean(process.env.VERCEL);
const vercelUploadError = new ApiError(
  httpStatus.BAD_REQUEST,
  'Local file upload is not supported on Vercel. Use external storage such as Supabase Storage, Cloudinary, or S3.'
);

const mapUploadDir = path.join(__dirname, '..', '..', 'public', 'maps');
const locationUploadDir = path.join(__dirname, '..', '..', 'public', 'locations');
const travelDestinationUploadDir = path.join(__dirname, '..', '..', 'public', 'travel-destinations');
const view360AudioUploadDir = path.join(__dirname, '..', '..', 'public', 'view360-audio');
const view360ImageUploadDir = path.join(__dirname, '..', '..', 'public', 'view360-images');
const userAvatarUploadDir = path.join(__dirname, '..', '..', 'public', 'users');
const tourThumbnailUploadDir = path.join(__dirname, '..', '..', 'public', 'tours');
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
const allowedAudioExtensions = new Set(['.mp3', '.wav', '.ogg', '.m4a']);
const allowedAudioMimeTypes = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
]);

if (!isVercel) {
  fs.mkdirSync(mapUploadDir, { recursive: true });
  fs.mkdirSync(locationUploadDir, { recursive: true });
  fs.mkdirSync(travelDestinationUploadDir, { recursive: true });
  fs.mkdirSync(view360AudioUploadDir, { recursive: true });
  fs.mkdirSync(view360ImageUploadDir, { recursive: true });
  fs.mkdirSync(userAvatarUploadDir, { recursive: true });
  fs.mkdirSync(tourThumbnailUploadDir, { recursive: true });
  fs.mkdirSync(reviewUploadDir, { recursive: true });
}

const createStorage = (uploadDir, fallbackName) => multer.diskStorage({
  destination: (req, file, cb) => {
    if (isVercel) {
      cb(vercelUploadError);
      return;
    }

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
const locationThumbnailStorage = createStorage(locationUploadDir, 'location-thumbnail');
const travelDestinationThumbnailStorage = createStorage(travelDestinationUploadDir, 'travel-destination-thumbnail');
const view360AudioStorage = createStorage(view360AudioUploadDir, 'view360-audio');
const view360ImageStorage = createStorage(view360ImageUploadDir, 'view360-image');
const userAvatarStorage = createStorage(userAvatarUploadDir, 'user-avatar');
const tourThumbnailStorage = createStorage(tourThumbnailUploadDir, 'tour-thumbnail');
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

const locationThumbnailFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedReviewPhotoExtensions.has(ext) || !allowedReviewPhotoMimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Unsupported location thumbnail format'));
    return;
  }

  cb(null, true);
};

const view360AudioFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedAudioExtensions.has(ext) || !allowedAudioMimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Unsupported View360 audio format'));
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

const uploadLocationThumbnail = multer({
  storage: locationThumbnailStorage,
  fileFilter: locationThumbnailFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadTravelDestinationThumbnail = multer({
  storage: travelDestinationThumbnailStorage,
  fileFilter: locationThumbnailFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadView360Audio = multer({
  storage: view360AudioStorage,
  fileFilter: view360AudioFileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const uploadView360Image = multer({
  storage: view360ImageStorage,
  fileFilter: locationThumbnailFileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

const uploadUserAvatar = multer({
  storage: userAvatarStorage,
  fileFilter: locationThumbnailFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadTourThumbnail = multer({
  storage: tourThumbnailStorage,
  fileFilter: locationThumbnailFileFilter,
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

const handleLocationThumbnailUpload = (req, res, next) => {
  uploadLocationThumbnail.single('thumbnail_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.thumbnail = `/public/locations/${req.file.filename}`;
      }
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

const handleTravelDestinationThumbnailUpload = (req, res, next) => {
  uploadTravelDestinationThumbnail.single('thumbnail_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.thumbnail = `/public/travel-destinations/${req.file.filename}`;
      }
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

const handleView360AudioUpload = (req, res, next) => {
  uploadView360Audio.single('audio_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.audio_file = `/public/view360-audio/${req.file.filename}`;
      }
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

const handleView360ImageUpload = (req, res, next) => {
  uploadView360Image.single('image_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.image_file = `/public/view360-images/${req.file.filename}`;
      }
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

const handleUserAvatarUpload = (req, res, next) => {
  uploadUserAvatar.fields([
    { name: 'avatar_file', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'avatar_url', maxCount: 1 },
  ])(req, res, (error) => {
    if (!error) {
      delete req.body.avatar_file;
      delete req.body.avatar;

      const avatarFile = req.files?.avatar_file?.[0]
        || req.files?.avatar?.[0]
        || req.files?.avatar_url?.[0];

      if (avatarFile) {
        req.body.avatar_url = `/public/users/${avatarFile.filename}`;
      }

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

const handleTourThumbnailUpload = (req, res, next) => {
  uploadTourThumbnail.single('thumbnail_file')(req, res, (error) => {
    if (!error) {
      if (req.file) {
        req.body.thumbnail = `/public/tours/${req.file.filename}`;
      }

      if (typeof req.body.destinations === 'string') {
        try {
          req.body.destinations = JSON.parse(req.body.destinations);
        } catch (parseError) {
          next(new ApiError(httpStatus.BAD_REQUEST, 'destinations must be valid JSON'));
          return;
        }
      }

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
  handleLocationThumbnailUpload,
  handleTravelDestinationThumbnailUpload,
  handleView360AudioUpload,
  handleView360ImageUpload,
  handleUserAvatarUpload,
  handleTourThumbnailUpload,
  handleReviewPhotoUpload,
};
