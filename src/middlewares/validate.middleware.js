const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

module.exports = (schema) => (req, res, next) => {
  const segments = ['body', 'params', 'query'];
  const details = {};

  for (const segment of segments) {
    if (!schema[segment]) continue;

    const { value, error } = schema[segment].validate(req[segment], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      details[segment] = error.details.map((item) => item.message);
    } else {
      req[segment] = value;
    }
  }

  if (Object.keys(details).length) {
    next(new ApiError(httpStatus.BAD_REQUEST, messages.VALIDATION_ERROR, details));
    return;
  }

  next();
};

