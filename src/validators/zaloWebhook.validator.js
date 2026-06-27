const Joi = require('joi');

module.exports = {
  handle: {
    body: Joi.object().unknown(true),
    options: {
      stripUnknown: false,
    },
  },
};
