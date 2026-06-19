const BaseService = require('./base.service');
const reviewModel = require('../models/review.model');
const reviewPhotoModel = require('../models/reviewPhoto.model');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFiles } = require('../utils/uploadedFile');

class ReviewService extends BaseService {
  async publicList(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = [
      'r.deleted_at IS NULL',
      "r.status = 'approved'",
    ];

    if (query.location_id) {
      values.push(query.location_id);
      clauses.push(`r.location_id = $${values.length}`);
    }
    if (query.rating) {
      values.push(query.rating);
      clauses.push(`r.rating = $${values.length}`);
    }
    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`r.comment ILIKE $${values.length}`);
    }

    values.push(limit, offset);
    const result = await db.query(
      `SELECT r.*
       FROM review r
       WHERE ${clauses.join(' AND ')}
       ORDER BY r.review_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return result.rows;
  }

  async publicGet(id) {
    const result = await db.query(
      `SELECT *
       FROM review
       WHERE review_id = $1
         AND deleted_at IS NULL
         AND status = 'approved'`,
      [id]
    );

    const review = result.rows[0];
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }
    return review;
  }

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

    const photos = await reviewPhotoModel.softDeleteByReview(id);
    await removeUploadedFiles(photos.map((photo) => photo.photo_url));

    return review;
  }
}

module.exports = new ReviewService(reviewModel);
