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

  updateBookingTourReview: {
    params: Joi.object({
      bookingId: id.required(),
    }),
    body: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().trim().max(1000).allow('', null),
    }),
  },

  deleteBookingTourReview: {
    params: Joi.object({
      bookingId: id.required(),
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

  updateLocationReview: {
    params: Joi.object({
      locationId: id.required(),
      reviewId: id.required(),
    }),
    body: Joi.object({
      rating: Joi.number().integer().min(1).max(5).required(),
      comment: Joi.string().trim().max(1000).allow('', null),
    }),
  },

  deleteLocationReview: {
    params: Joi.object({
      locationId: id.required(),
      reviewId: id.required(),
    }),
  },
};
