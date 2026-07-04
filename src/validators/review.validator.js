const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  submitLocationReview: {
    params: Joi.object({
      locationId: id.required(),
    }),
    body: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().trim().max(1000).allow('', null),
    }),
  },
};
