const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

module.exports = (schema) => (req, res, next) => {
  const segments = ['body', 'params', 'query'];
  const details = {};
  const defaultOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  };

  for (const segment of segments) {
    if (!schema[segment]) continue;

    const options = { ...defaultOptions, ...(schema.options || {}) };
    const { value, error } = schema[segment].validate(req[segment], options);

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

