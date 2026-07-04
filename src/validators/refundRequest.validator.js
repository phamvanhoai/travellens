const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      booking_id: id,
      payment_id: id,
      status: Joi.string().valid('pending', 'approved', 'rejected', 'completed'),
    }),
  },

  review: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      staff_note: Joi.string().trim().max(1000).allow(null, ''),
    }).default({}),
  },

  complete: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      transaction_code: Joi.string().trim().max(100).allow(null, ''),
      staff_note: Joi.string().trim().max(1000).allow(null, ''),
    }).default({}),
  },
};
