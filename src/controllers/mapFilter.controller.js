const mapFilterService = require('../services/mapFilter.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  filter: asyncHandler(async (req, res) => {
    const data = await mapFilterService.filter(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  }),
};
