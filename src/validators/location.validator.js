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

const coordinates = {
  latitude: Joi.number().min(-90).max(90).allow(null),
  longitude: Joi.number().min(-180).max(180).allow(null),
};

const validateCoordinatePair = (value, helpers) => {
  const hasLatitude = value.latitude !== undefined && value.latitude !== null;
  const hasLongitude = value.longitude !== undefined && value.longitude !== null;
  if (hasLatitude !== hasLongitude) {
    return helpers.message({ custom: 'Latitude and longitude must be provided together or both left empty' });
  }
  return value;
};

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
      ...coordinates,
      thumbnail,
    }).custom(validateCoordinatePair),
  },

  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      travel_destination_id: id,
      name: Joi.string().trim().max(255),
      description: optionalText,
      ...coordinates,
      thumbnail,
    }).min(1).custom(validateCoordinatePair),
  },
};
