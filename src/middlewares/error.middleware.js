const logger = require('../config/logger');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = httpStatus.NOT_FOUND;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = statusCode === httpStatus.INTERNAL_SERVER_ERROR
    ? 'Internal server error'
    : error.message;

  logger.error(message, {
    stack: error.stack,
    details: error.details,
    path: req.originalUrl,
    method: req.method,
  });

  response.error(res, message, statusCode, error.details);
};

module.exports = {
  notFound,
  errorHandler,
};

