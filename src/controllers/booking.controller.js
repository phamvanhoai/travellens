const createController = require('./base.controller');
const bookingService = require('../services/booking.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

module.exports = {
  ...createController(bookingService),

  customerList: asyncHandler(async (req, res) => {
    const data = await bookingService.listForUser(req.user.sub, req.query);
    response.success(res, data);
  }),

  customerGet: asyncHandler(async (req, res) => {
    const data = await bookingService.getForUser(req.params.id, req.user.sub);
    response.success(res, data);
  }),

  customerCreate: asyncHandler(async (req, res) => {
    const data = await bookingService.createForUser(req.body, req.user.sub);
    response.success(res, data, 'Created', 201);
  }),

  customerUpdate: asyncHandler(async (req, res) => {
    const data = await bookingService.updateForUser(req.params.id, req.user.sub, req.body);
    response.success(res, data, 'Updated');
  }),

  customerRemove: asyncHandler(async (req, res) => {
    const data = await bookingService.removeForUser(req.params.id, req.user.sub);
    response.success(res, data, 'Deleted');
  }),

  // CUSTOM LIST
  list: asyncHandler(async (req, res) => {
    const data = await bookingService.list(req.query);
    response.success(res, data);
  }),

  history: asyncHandler(async (req, res) => {
    const data = await bookingService.getHistory(req.params.id);
    response.success(res, data);
  }),

  // CANCEL BOOKING
  cancel: asyncHandler(async (req, res) => {
    const data = await bookingService.cancel(req.params.id, {
      canceledBy: req.user?.sub,
      reason: req.body?.reason,
    });
    response.success(res, data, 'Booking canceled');
  }),

  customerCancel: asyncHandler(async (req, res) => {
    const data = await bookingService.cancelForUser(req.params.id, req.user.sub, req.body);
    response.success(res, data, 'Booking canceled');
  }),
};
