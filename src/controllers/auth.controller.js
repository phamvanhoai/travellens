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
    const data = await authService.verifyEmail(req.body);
    response.success(res, data, 'Email verified successfully');
  }),

  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    response.success(res, data, 'Logged in successfully');
  }),

  changePassword: asyncHandler(async (req, res) => {
    const data = await authService.changePassword(req.user.sub, req.body);
    response.success(res, data, 'Password changed successfully');
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
  forgotPassword: asyncHandler(async (req, res) => {
    const data = await authService.forgotPassword(req.body);
    response.success(res, data, 'Password reset code sent');
  }),
  verifyResetCode: asyncHandler(async (req, res) => {
    const data = await authService.verifyResetCode(req.body);
    response.success(res, data, 'Verification code verified successfully');
  }),
  resetPassword: asyncHandler(async (req, res) => {
    const data = await authService.resetPassword(req.body);
    response.success(res, data, 'Password reset successfully');
  }),
};
