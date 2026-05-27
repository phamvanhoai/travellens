const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  route: {
    params: Joi.object({
      tourId: id.required(),
    }),
  },
};
