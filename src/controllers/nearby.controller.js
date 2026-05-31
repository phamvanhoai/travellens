const nearbyService = require('../services/nearby.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  suggest: asyncHandler(async (req, res) => {
    const data = await nearbyService.suggest(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  }),
};
