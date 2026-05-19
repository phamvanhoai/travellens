const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    next(new ApiError(httpStatus.UNAUTHORIZED, messages.UNAUTHORIZED));
    return;
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    next(new ApiError(httpStatus.FORBIDDEN, messages.FORBIDDEN));
    return;
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
};

