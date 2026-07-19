const Joi = require('joi');

const id = Joi.number().integer().positive();
const mediaUrl = Joi.string().trim().custom((value, helpers) => {
  if (value.startsWith('/public/travel-stories/')) return value;
  return Joi.string().uri().validate(value).error ? helpers.error('string.uri') : value;
});

module.exports = {
  list: { query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(30),
  }) },
  mine: { query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(30),
    status: Joi.string().valid('active', 'expired', 'all').default('active'),
  }) },
  create: { body: Joi.object({
    media_url: mediaUrl.required(),
    media_type: Joi.string().valid('image', 'video').required(),
    caption: Joi.string().trim().max(1000).allow(null, ''),
  }) },
  action: { params: Joi.object({ id: id.required() }) },
  viewers: {
    params: Joi.object({ id: id.required() }),
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(30),
    }),
  },
};
