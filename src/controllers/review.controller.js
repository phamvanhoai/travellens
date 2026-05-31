const createController = require('./base.controller');
const reviewService = require('../services/review.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

const baseController = createController(reviewService);

module.exports = {
  ...baseController,

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

  remove: asyncHandler(async (req, res) => {
    const data = await reviewService.remove(req.params.id);
    response.success(res, data, 'Review deleted successfully');
  }),
};
