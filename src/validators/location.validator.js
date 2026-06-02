const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().trim().allow(null, '');
const thumbnail = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/locations/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      destination_id: id,
      sortBy: Joi.string().valid('location_id', 'name', 'created_at', 'updated_at').default('created_at'),
      sortOrder: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
    }),
  },

  create: {
    body: Joi.object({
      travel_destination_id: id.required(),
      name: Joi.string().trim().max(255).required(),
      description: optionalText,
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null),
      thumbnail,
    }),
  },

  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      name: Joi.string().trim().max(255),
      description: optionalText,
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null),
      thumbnail,
    }).min(1),
  },
};
