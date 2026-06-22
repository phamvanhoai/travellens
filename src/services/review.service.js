const BaseService = require('./base.service');
const reviewModel = require('../models/review.model');
const reviewPhotoModel = require('../models/reviewPhoto.model');
const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFiles } = require('../utils/uploadedFile');

class ReviewService extends BaseService {
  async publicList(query = {}) {
    return reviewModel.findApproved(query);
  }

  async publicGet(id) {
    const review = await reviewModel.findApprovedById(id);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }
    return review;
  }

  async submitLocationReview(locationId, userId, payload) {
    const location = await locationModel.findActiveById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
    }

    const existingReview = await this.model.findActiveByUserAndLocation(userId, locationId);
    if (existingReview) {
      throw new ApiError(httpStatus.CONFLICT, 'Review Already Exists');
    }

    return this.model.createLocationReview({
      userId,
      locationId,
      rating: payload.rating,
      comment: payload.comment,
      status: 'approved',
    });
  }

  async remove(id) {
    const review = await this.model.softDelete(id);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    const photos = await reviewPhotoModel.softDeleteByReview(id);
    await removeUploadedFiles(photos.map((photo) => photo.photo_url));

    return review;
  }
}

module.exports = new ReviewService(reviewModel);
