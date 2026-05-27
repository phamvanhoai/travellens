const navigationService = require('../services/navigation.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  getRoute: asyncHandler(async (req, res) => {
    const data = await navigationService.getRoute(req.params.tourId);
    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  }),
};
