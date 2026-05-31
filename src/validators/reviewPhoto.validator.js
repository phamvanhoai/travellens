const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  uploadForReview: {
    params: Joi.object({
      reviewId: id.required(),
    }),
  },
};
