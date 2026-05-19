const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    response.success(res, data, 'Registered successfully', httpStatus.CREATED);
  }),

  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    response.success(res, data, 'Logged in successfully');
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const data = await authService.googleLogin(req.body);
    response.success(res, data, 'Google login successfully');
  }),
};

