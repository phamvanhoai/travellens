const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  create: {
    body: Joi.object({
      booking_id: id.required(),
    }),
  },

  idParam: {
    params: Joi.object({
      id: id.required(),
    }),
  },

  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().trim().allow(''),
      booking_id: id,
      status: Joi.string().valid('pending', 'paid', 'failed', 'expired', 'refunded'),
    }),
  },

  updateStatus: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      status: Joi.string().valid('pending', 'paid', 'failed', 'expired', 'refunded').required(),
    }),
  },

  refund: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      amount: Joi.number().min(0),
      transaction_code: Joi.string().trim().allow(null, ''),
    }).default({}),
  },
};
