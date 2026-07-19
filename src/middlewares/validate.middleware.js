const ApiError = require('../utils/ApiError');
const { httpStatus, messages } = require('../constants');

module.exports = (schema) => (req, res, next) => {
  const segments = ['body', 'params', 'query'];
  const details = {};
  const fieldDetails = [];
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
      const messagesForSegment = [];

      for (const item of error.details) {
        const field = item.path.join('.');

        messagesForSegment.push(item.message);
        fieldDetails.push({
          segment,
          field,
          message: item.message,
          type: item.type,
        });
      }

      details[segment] = messagesForSegment;
    } else {
      req[segment] = value;
    }
  }

  if (Object.keys(details).length) {
    if (fieldDetails.length) {
      details.fields = fieldDetails;
    }

    next(new ApiError(
      httpStatus.BAD_REQUEST,
      fieldDetails[0] ? fieldDetails[0].message : messages.VALIDATION_ERROR,
      details
    ));
    return;
  }

  next();
};

