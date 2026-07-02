const createController = require('./base.controller');
const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

const baseController = createController(reviewService);

module.exports = {
  ...baseController,

  publicList: asyncHandler(async (req, res) => {
    const data = await reviewService.publicList(req.query);
    response.success(res, data);
  }),

  publicGet: asyncHandler(async (req, res) => {
    const data = await reviewService.publicGet(req.params.id);
    response.success(res, data);
  }),

  submitLocationReview: asyncHandler(async (req, res) => {
    const data = await reviewService.submitLocationReview(
      req.params.locationId,
      req.user.sub,
      req.body
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review_id: data.review_id,
        location_id: data.location_id,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }),

  updateLocationReview: asyncHandler(async (req, res) => {
    const data = await reviewService.updateLocationReview(
      req.params.locationId,
      req.params.reviewId,
      req.user.sub,
      req.body
    );

    response.success(res, data, 'Review updated successfully');
  }),

  deleteLocationReview: asyncHandler(async (req, res) => {
    const data = await reviewService.deleteLocationReview(
      req.params.locationId,
      req.params.reviewId,
      req.user.sub
    );

    response.success(res, data, 'Review deleted successfully');
  }),

  listTourReviews: asyncHandler(async (req, res) => {
    const data = await reviewService.listTourReviews(req.params.tourId, req.query);
    response.success(res, data);
  }),

  submitBookingTourReview: asyncHandler(async (req, res) => {
    const data = await reviewService.submitBookingTourReview(
      req.params.bookingId,
      req.user.sub,
      req.body
    );

    response.success(res, data, 'Review submitted successfully', httpStatus.CREATED);
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await reviewService.remove(req.params.id);
    response.success(res, data, 'Review deleted successfully');
  }),
};
