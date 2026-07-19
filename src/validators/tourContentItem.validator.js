const Joi = require('joi');

const id = Joi.number().integer().positive();
const type = Joi.string().valid(
  'highlight', 'requirement', 'inclusion', 'exclusion',
  'booking_policy', 'cancellation_policy', 'additional_information'
);

module.exports = {
  list: { query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    search: Joi.string().allow(''),
    type,
    status: Joi.string().valid('active', 'inactive'),
  }) },
  detail: { params: Joi.object({ id: id.required() }) },
  create: { body: Joi.object({
    type: type.required(),
    content: Joi.string().trim().min(1).max(5000).required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
  }) },
  update: {
    params: Joi.object({ id: id.required() }),
    body: Joi.object({
      type,
      content: Joi.string().trim().min(1).max(5000),
      status: Joi.string().valid('active', 'inactive'),
    }).min(1),
  },
  remove: { params: Joi.object({ id: id.required() }) },
};

