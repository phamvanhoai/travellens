const BaseService = require('./base.service');
const reviewModel = require('../models/review.model');
const reviewPhotoModel = require('../models/reviewPhoto.model');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class ReviewService extends BaseService {
  async submitLocationReview(locationId, userId, payload) {
    const locationResult = await db.query(
      `SELECT location_id
       FROM location
       WHERE location_id = $1
         AND deleted_at IS NULL
         AND is_deleted = FALSE`,
      [locationId]
    );

    if (!locationResult.rows[0]) {
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

    await reviewPhotoModel.softDeleteByReview(id);

    return review;
  }
}

module.exports = new ReviewService(reviewModel);
