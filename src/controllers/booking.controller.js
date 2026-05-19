const createController = require('./base.controller');
const bookingService = require('../services/booking.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  ...createController(bookingService),
  cancel: asyncHandler(async (req, res) => {
    const data = await bookingService.cancel(req.params.id);
    response.success(res, data, 'Booking canceled');
  }),
};

