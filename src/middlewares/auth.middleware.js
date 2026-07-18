const jwt = require('jsonwebtoken');
const db = require('../config/db');
const revokedTokenModel = require('../models/revokedToken.model');
const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    next(new ApiError(httpStatus.UNAUTHORIZED, messages.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isRevoked = await revokedTokenModel.isRevoked(token);
    if (isRevoked) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Token has been revoked'));
      return;
    }

    req.token = token;
    req.user = decoded;

    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

const authorize = (...roles) => async (req, res, next) => {
  try {
    if (!req.user) {
      next(new ApiError(httpStatus.UNAUTHORIZED, messages.UNAUTHORIZED));
      return;
    }

    const result = await db.query(
      'SELECT user_id, role, status FROM users WHERE user_id = $1',
      [req.user.sub]
    );

    const user = result.rows[0];

    if (!user || (user.status && user.status !== 'active')) {
      next(new ApiError(httpStatus.FORBIDDEN, messages.FORBIDDEN));
      return;
    }

    req.user.role = user.role;

    if (!roles.includes(user.role)) {
      next(new ApiError(httpStatus.FORBIDDEN, messages.FORBIDDEN));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const requireActiveAccount = async (req, res, next) => {
  try {
    if (!req.user) {
      next(new ApiError(httpStatus.UNAUTHORIZED, messages.UNAUTHORIZED));
      return;
    }

    const result = await db.query(
      'SELECT user_id, role, status FROM users WHERE user_id = $1',
      [req.user.sub]
    );

    const user = result.rows[0];

    if (!user) {
      next(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
      return;
    }

    if (user.status && user.status !== 'active') {
      next(new ApiError(httpStatus.FORBIDDEN, 'Account is not active'));
      return;
    }

    req.user.role = user.role;
    req.user.status = user.status;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional auth: sets req.user if a valid token is present, otherwise continues without error.
 */
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(); // No token, continue as guest
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isRevoked = await revokedTokenModel.isRevoked(token);
    if (!isRevoked) {
      req.token = token;
      req.user = decoded;
    }
  } catch (error) {
    // Invalid token, just continue as guest
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
  requireActiveAccount,
  optionalAuth,
};
