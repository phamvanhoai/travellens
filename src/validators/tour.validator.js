const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().allow(null, '');
const thumbnail = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/tours/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');

const destinationSchema = Joi.object({
  destination_id: id.required(),
  order_index: Joi.number().integer().min(1).required(),
  estimated_time: optionalText,
  note: optionalText,
});

const tourBody = {
  tour_category_id: id.required(),
  name: Joi.string().trim().max(255).required(),
  description: optionalText,
  price: Joi.number().min(0).required(),
  child_price: Joi.number().min(0).required(),
  schedule: Joi.string().trim().required(),
  capacity: Joi.number().integer().min(1).required(),
  thumbnail,
  status: Joi.string().valid('active', 'inactive', 'draft').default('active'),
};

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().allow(''),
      destination_id: id,
      tour_category_id: id,
      status: Joi.string().valid('active', 'inactive', 'draft', 'deleted'),
      sortBy: Joi.string().valid('tour_id', 'name', 'price', 'capacity', 'status', 'created_at', 'updated_at').default('created_at'),
      sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    }).unknown(false),
  },
  detail: {
    params: Joi.object({
      id: id.required(),
    }),
  },
  create: {
    body: Joi.object({
      ...tourBody,
      destinations: Joi.array().items(destinationSchema).min(1).required(),
    }),
  },
  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      tour_category_id: id,
      name: Joi.string().trim().max(255),
      description: optionalText,
      price: Joi.number().min(0),
      child_price: Joi.number().min(0),
      schedule: Joi.string().trim(),
      capacity: Joi.number().integer().min(1),
      thumbnail,
      status: Joi.string().valid('active', 'inactive', 'draft'),
      destinations: Joi.array().items(destinationSchema).min(1),
    }).min(1),
  },
  remove: {
    params: Joi.object({
      id: id.required(),
    }),
  },
};
