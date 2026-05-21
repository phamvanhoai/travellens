const jwt = require('jsonwebtoken');
const db = require('../config/db');
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

module.exports = {
  authenticate,
  authorize,
};
