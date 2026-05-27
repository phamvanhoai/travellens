const reviewPhotoService = require('../services/reviewPhoto.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  uploadForReview: asyncHandler(async (req, res) => {
    const data = await reviewPhotoService.uploadForReview(
      req.params.reviewId,
      req.user.sub,
      req.files || []
    );

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Review photos uploaded successfully',
      data,
    });
  }),
};
