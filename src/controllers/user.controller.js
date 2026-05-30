const createController = require('./base.controller');
const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  ...createController(userService),

  list: asyncHandler(async (req, res) => {
    const data = await userService.list(req.query);
    res.status(httpStatus.OK).json({
      success: true,
      data: data.items,
      pagination: data.pagination,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const data = await userService.create(req.body);
    response.success(res, data, 'User created successfully', httpStatus.CREATED);
  }),
};

