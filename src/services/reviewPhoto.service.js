const reviewModel = require('../models/review.model');
const reviewPhotoModel = require('../models/reviewPhoto.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class ReviewPhotoService {
  async uploadForReview(reviewId, userId, files = []) {
    if (!files.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'photos[] is required');
    }

    const review = await reviewModel.findActiveOwner(reviewId);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review Not Found');
    }

    if (Number(review.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied');
    }

    const existingCount = await reviewPhotoModel.countActiveByReview(reviewId);
    if (existingCount + files.length > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'A review can have at most 5 photos');
    }

    const photos = files.map((file) => ({
      photo_url: file.url || `/public/reviews/${file.filename}`,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
    }));

    return reviewPhotoModel.createMany(reviewId, photos);
  }
}

module.exports = new ReviewPhotoService();
