const BaseService = require('./base.service');
const reviewModel = require('../models/review.model');
const reviewPhotoModel = require('../models/reviewPhoto.model');
const locationModel = require('../models/location.model');
const bookingModel = require('../models/booking.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFiles } = require('../utils/uploadedFile');

class ReviewService extends BaseService {
  list(query = {}) {
    return reviewModel.findForStaff(query);
  }

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

  async updateLocationReview(locationId, reviewId, userId, payload) {
    const location = await locationModel.findActiveById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
    }

    const review = await this.model.findActiveLocationOwner(reviewId, locationId);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (Number(review.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own review');
    }

    return this.model.updateLocationReview(reviewId, locationId, {
      rating: payload.rating,
      comment: payload.comment,
    });
  }

  async deleteLocationReview(locationId, reviewId, userId) {
    const location = await locationModel.findActiveById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location Not Found');
    }

    const review = await this.model.findActiveLocationOwner(reviewId, locationId);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (Number(review.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own review');
    }

    return this.remove(reviewId);
  }

  async listTourReviews(tourId, query = {}) {
    return this.model.findApproved({
      ...query,
      tour_id: tourId,
    });
  }

  async submitBookingTourReview(bookingId, userId, payload) {
    const booking = await bookingModel.findOwnedReviewContext(bookingId, userId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.payment_status !== 'paid') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Only paid bookings can be reviewed');
    }

    if (!['confirmed', 'paid'].includes(booking.status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Only confirmed bookings can be reviewed');
    }

    if (!booking.departure_at) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Booking departure time is required before review');
    }

    const departureTime = new Date(booking.departure_at).getTime();
    if (Number.isNaN(departureTime) || departureTime > Date.now()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tour can only be reviewed after departure time');
    }

    const existingReview = await this.model.findActiveByBooking(booking.booking_id);
    if (existingReview) {
      throw new ApiError(httpStatus.CONFLICT, 'Booking has already been reviewed');
    }

    return this.model.createTourReview({
      userId,
      bookingId: booking.booking_id,
      tourId: booking.tour_id,
      rating: payload.rating,
      comment: payload.comment,
      status: 'approved',
    });
  }

  async updateBookingTourReview(bookingId, userId, payload) {
    const booking = await bookingModel.findOwnedReviewContext(bookingId, userId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    const review = await this.model.findActiveByBookingWithOwner(booking.booking_id);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (Number(review.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own review');
    }

    return this.model.updateBookingTourReview(booking.booking_id, {
      rating: payload.rating,
      comment: payload.comment,
    });
  }

  async deleteBookingTourReview(bookingId, userId) {
    const booking = await bookingModel.findOwnedReviewContext(bookingId, userId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    const review = await this.model.findActiveByBookingWithOwner(booking.booking_id);
    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    if (Number(review.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own review');
    }

    return this.remove(review.review_id);
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
