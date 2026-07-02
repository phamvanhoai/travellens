const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  tourReviews: {
    params: Joi.object({
      tourId: id.required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      rating: Joi.number().integer().min(1).max(5),
      search: Joi.string().trim().allow(''),
    }),
  },

  submitBookingTourReview: {
    params: Joi.object({
      bookingId: id.required(),
    }),
    body: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().trim().max(1000).allow('', null),
    }),
  },

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
