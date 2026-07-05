const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const objectStorage = require('../services/objectStorage.service');
const { httpStatus } = require('../constants');

const isVercel = Boolean(process.env.VERCEL);
const useObjectStorage = objectStorage.isEnabled;

const uploadDirs = {
  maps: path.join(__dirname, '..', '..', 'public', 'maps'),
  locations: path.join(__dirname, '..', '..', 'public', 'locations'),
  travelDestinations: path.join(__dirname, '..', '..', 'public', 'travel-destinations'),
  view360Audio: path.join(__dirname, '..', '..', 'public', 'view360-audio'),
  view360Images: path.join(__dirname, '..', '..', 'public', 'view360-images'),
  users: path.join(__dirname, '..', '..', 'public', 'users'),
  tours: path.join(__dirname, '..', '..', 'public', 'tours'),
  reviews: path.join(__dirname, '..', '..', 'public', 'reviews'),
  media: path.join(__dirname, '..', '..', 'public', 'media'),
  blogs: path.join(__dirname, '..', '..', 'public', 'blogs'),
};

const allowedMapExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const allowedMapMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);
const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const allowedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
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

if (!isVercel && !useObjectStorage) {
  Object.values(uploadDirs).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
}

const createDiskStorage = (uploadDir, fallbackName) => multer.diskStorage({
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

const createFileFilter = (extensions, mimeTypes, message) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!extensions.has(ext) || !mimeTypes.has(file.mimetype)) {
    cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, message));
    return;
  }

  cb(null, true);
};

const mapFileFilter = createFileFilter(allowedMapExtensions, allowedMapMimeTypes, 'Unsupported map file format');
const imageFileFilter = createFileFilter(allowedImageExtensions, allowedImageMimeTypes, 'Unsupported image format');
const audioFileFilter = createFileFilter(allowedAudioExtensions, allowedAudioMimeTypes, 'Unsupported View360 audio format');

const createUploader = ({ uploadDir, fallbackName, fileFilter, limits }) => multer({
  storage: useObjectStorage
    ? multer.memoryStorage()
    : createDiskStorage(uploadDir, fallbackName),
  fileFilter,
  limits,
});

const uploadMap = createUploader({
  uploadDir: uploadDirs.maps,
  fallbackName: 'map',
  fileFilter: mapFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadLocationThumbnail = createUploader({
  uploadDir: uploadDirs.locations,
  fallbackName: 'location-thumbnail',
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadTravelDestinationThumbnail = createUploader({
  uploadDir: uploadDirs.travelDestinations,
  fallbackName: 'travel-destination-thumbnail',
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadView360Audio = createUploader({
  uploadDir: uploadDirs.view360Audio,
  fallbackName: 'view360-audio',
  fileFilter: audioFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const uploadView360Image = createUploader({
  uploadDir: uploadDirs.view360Images,
  fallbackName: 'view360-image',
  fileFilter: imageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const uploadUserAvatar = createUploader({
  uploadDir: uploadDirs.users,
  fallbackName: 'user-avatar',
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadTourThumbnail = createUploader({
  uploadDir: uploadDirs.tours,
  fallbackName: 'tour-thumbnail',
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadReviewPhotos = createUploader({
  uploadDir: uploadDirs.reviews,
  fallbackName: 'review-photo',
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

const uploadMedia = createUploader({
  uploadDir: uploadDirs.media,
  fallbackName: 'media-image',
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadBlogThumbnail = createUploader({
  uploadDir: uploadDirs.blogs,
  fallbackName: 'blog-thumbnail',
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadUnavailableOnVercel = () => new ApiError(
  httpStatus.BAD_REQUEST,
  'Object Storage is not configured. Set OBJECT_STORAGE_* environment variables for upload on Vercel.'
);

const processMulterError = (error) => {
  if (error instanceof multer.MulterError) {
    const statusCode = error.code === 'LIMIT_FILE_SIZE'
      ? httpStatus.PAYLOAD_TOO_LARGE
      : httpStatus.BAD_REQUEST;
    return new ApiError(statusCode, error.message);
  }

  return error;
};

const setSingleFileUrl = async ({ req, file, bodyField, folder, localPrefix, fallbackName }) => {
  if (!file) return;

  if (useObjectStorage) {
    const uploaded = await objectStorage.uploadFile({ file, folder, fallbackName });
    req.body[bodyField] = uploaded.url;
    return;
  }

  req.body[bodyField] = `${localPrefix}/${file.filename}`;
};

const handleSingleUpload = ({
  uploader,
  fieldName,
  bodyField,
  folder,
  localPrefix,
  fallbackName,
  afterUpload,
}) => (req, res, next) => {
  if (isVercel && !useObjectStorage) {
    next(uploadUnavailableOnVercel());
    return;
  }

  uploader.single(fieldName)(req, res, async (error) => {
    if (error) {
      next(processMulterError(error));
      return;
    }

    try {
      await setSingleFileUrl({
        req,
        file: req.file,
        bodyField,
        folder,
        localPrefix,
        fallbackName,
      });

      if (afterUpload) {
        afterUpload(req);
      }

      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};

const parseTourDestinations = (req) => {
  if (typeof req.body.destinations !== 'string') return;

  try {
    req.body.destinations = JSON.parse(req.body.destinations);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'destinations must be valid JSON');
  }
};

const handleMapUpload = handleSingleUpload({
  uploader: uploadMap,
  fieldName: 'map_file',
  bodyField: 'map_file',
  folder: 'maps',
  localPrefix: '/public/maps',
  fallbackName: 'map',
});

const handleLocationThumbnailUpload = handleSingleUpload({
  uploader: uploadLocationThumbnail,
  fieldName: 'thumbnail_file',
  bodyField: 'thumbnail',
  folder: 'locations',
  localPrefix: '/public/locations',
  fallbackName: 'location-thumbnail',
});

const handleTravelDestinationThumbnailUpload = handleSingleUpload({
  uploader: uploadTravelDestinationThumbnail,
  fieldName: 'thumbnail_file',
  bodyField: 'thumbnail',
  folder: 'travel-destinations',
  localPrefix: '/public/travel-destinations',
  fallbackName: 'travel-destination-thumbnail',
});

const handleView360AudioUpload = handleSingleUpload({
  uploader: uploadView360Audio,
  fieldName: 'audio_file',
  bodyField: 'audio_file',
  folder: 'view360-audio',
  localPrefix: '/public/view360-audio',
  fallbackName: 'view360-audio',
});

const handleView360ImageUpload = handleSingleUpload({
  uploader: uploadView360Image,
  fieldName: 'image_file',
  bodyField: 'image_file',
  folder: 'view360-images',
  localPrefix: '/public/view360-images',
  fallbackName: 'view360-image',
});

const handleTourThumbnailUpload = handleSingleUpload({
  uploader: uploadTourThumbnail,
  fieldName: 'thumbnail_file',
  bodyField: 'thumbnail',
  folder: 'tours',
  localPrefix: '/public/tours',
  fallbackName: 'tour-thumbnail',
  afterUpload: parseTourDestinations,
});

const handleMediaUpload = handleSingleUpload({
  uploader: uploadMedia,
  fieldName: 'file',
  bodyField: 'file_url',
  folder: 'media',
  localPrefix: '/public/media',
  fallbackName: 'media-image',
});

const parseBlogArrays = (req) => {
  for (const field of ['category_ids', 'location_ids']) {
    if (typeof req.body[field] !== 'string') continue;
    try {
      req.body[field] = JSON.parse(req.body[field]);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${field} must be valid JSON`);
    }
  }
};

const handleBlogThumbnailUpload = handleSingleUpload({
  uploader: uploadBlogThumbnail,
  fieldName: 'thumbnail_file',
  bodyField: 'thumbnail',
  folder: 'blogs',
  localPrefix: '/public/blogs',
  fallbackName: 'blog-thumbnail',
  afterUpload: parseBlogArrays,
});

const handleUserAvatarUpload = (req, res, next) => {
  if (isVercel && !useObjectStorage) {
    next(uploadUnavailableOnVercel());
    return;
  }

  uploadUserAvatar.fields([
    { name: 'avatar_file', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'avatar_url', maxCount: 1 },
  ])(req, res, async (error) => {
    if (error) {
      next(processMulterError(error));
      return;
    }

    try {
      delete req.body.avatar_file;
      delete req.body.avatar;

      const avatarFile = req.files?.avatar_file?.[0]
        || req.files?.avatar?.[0]
        || req.files?.avatar_url?.[0];

      await setSingleFileUrl({
        req,
        file: avatarFile,
        bodyField: 'avatar_url',
        folder: 'users',
        localPrefix: '/public/users',
        fallbackName: 'user-avatar',
      });

      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};

const handleReviewPhotoUpload = (req, res, next) => {
  if (isVercel && !useObjectStorage) {
    next(uploadUnavailableOnVercel());
    return;
  }

  uploadReviewPhotos.array('photos', 5)(req, res, async (error) => {
    if (error) {
      next(processMulterError(error));
      return;
    }

    try {
      if (useObjectStorage && req.files?.length) {
        const uploadedFiles = await Promise.all(req.files.map(async (file) => {
          const uploaded = await objectStorage.uploadFile({
            file,
            folder: 'reviews',
            fallbackName: 'review-photo',
          });

          return {
            ...file,
            url: uploaded.url,
          };
        }));

        req.files = uploadedFiles;
      }

      next();
    } catch (uploadError) {
      next(uploadError);
    }
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
  handleMediaUpload,
  handleBlogThumbnailUpload,
};
