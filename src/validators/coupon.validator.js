const Joi = require('joi');

const id = Joi.number().integer().positive();
const money = Joi.number().min(0);
const optionalText = Joi.string().trim().allow(null, '');

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      status: Joi.string().valid('active', 'inactive', 'expired', 'archived'),
      discount_type: Joi.string().valid('percentage', 'fixed'),
      sortBy: Joi.string().valid('coupon_id', 'code', 'name', 'created_at', 'updated_at', 'start_date', 'end_date').default('created_at'),
      sortOrder: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
    }),
  },

  idParam: {
    params: Joi.object({
      id: id.required(),
    }),
  },

  create: {
    body: Joi.object({
      code: Joi.string().trim().uppercase().max(50).required(),
      name: Joi.string().trim().max(150).required(),
      description: optionalText,
      discount_type: Joi.string().valid('percentage', 'fixed').required(),
      discount_value: money.required(),
      max_discount_amount: money.allow(null),
      min_order_amount: money.default(0),
      usage_limit: Joi.number().integer().min(1).required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      status: Joi.string().valid('active', 'inactive', 'expired').default('active'),
    }),
  },

  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      name: Joi.string().trim().max(150),
      description: optionalText,
      discount_type: Joi.string().valid('percentage', 'fixed'),
      discount_value: money,
      max_discount_amount: money.allow(null),
      min_order_amount: money,
      usage_limit: Joi.number().integer().min(1),
      start_date: Joi.date(),
      end_date: Joi.date(),
      status: Joi.string().valid('active', 'inactive', 'expired'),
    }).min(1),
  },

  validateCoupon: {
    body: Joi.object({
      code: Joi.string().trim().uppercase().required(),
      booking_amount: money.required(),
    }),
  },
};
