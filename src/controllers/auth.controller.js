const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  register: asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    response.success(res, data, 'Registered successfully', httpStatus.CREATED);
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const data = await authService.verifyEmail(req.query.token);
    response.success(res, data, 'Email verified successfully');
  }),

  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    response.success(res, data, 'Logged in successfully');
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const data = await authService.googleLogin(req.body);
    response.success(res, data, 'Google login successfully');
  }),

  logout: asyncHandler(async (req, res) => {
    const data = await authService.logout(req.token, req.user);
    response.success(res, data, 'Logged out successfully');
  }),

  profile: asyncHandler(async (req, res) => {
    const data = await authService.getProfile(req.user.sub);
    response.success(res, data);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const data = await authService.updateProfile(req.user.sub, req.body);
    response.success(res, data, 'Profile updated successfully');
  }),
};
