const Joi = require('joi');

const id = Joi.number().integer().positive();
const type = Joi.string().valid(
  'highlight', 'requirement', 'inclusion', 'exclusion',
  'booking_policy', 'cancellation_policy', 'additional_information'
);
const listTypes = new Set(['highlight', 'requirement', 'inclusion', 'exclusion']);
const validateContentForType = (value, helpers) => {
  if (!value.items && value.content === undefined) return value;
  const maxLength = listTypes.has(value.type) ? 500 : 50000;
  const values = value.items || [value.content];
  for (const content of values) {
    if (content.length > maxLength) return helpers.error('string.max', { limit: maxLength });
    if (listTypes.has(value.type) && /[\r\n]/.test(content)) return helpers.message({ custom: 'List content must contain exactly one line' });
  }
  return value;
};

module.exports = {
  list: { query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
    search: Joi.string().allow(''),
    type,
    status: Joi.string().valid('active', 'inactive'),
    sort: Joi.string().valid('created_at', 'updated_at', 'content', 'type').default('created_at'),
    order: Joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('desc'),
  }) },
  detail: { params: Joi.object({ id: id.required() }) },
  create: { body: Joi.object({
    type: type.required(),
    content: Joi.string().trim().min(1).max(50000).required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
  }).custom(validateContentForType) },
  bulkCreate: { body: Joi.object({
    type: type.required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
    items: Joi.array().items(Joi.string().trim().min(1).max(50000).required()).min(1).max(100).required(),
  }).custom(validateContentForType) },
  update: {
    params: Joi.object({ id: id.required() }),
    body: Joi.object({
      type,
      content: Joi.string().trim().min(1).max(50000),
      status: Joi.string().valid('active', 'inactive'),
    }).min(1).custom(validateContentForType),
  },
  remove: { params: Joi.object({ id: id.required() }) },
};
