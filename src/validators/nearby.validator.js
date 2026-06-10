const Joi = require('joi');

module.exports = {
  suggest: {
    query: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
      radius: Joi.number().positive().max(500).default(5),
    }),
  },
};
