const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().trim().allow(null, '');

module.exports = {
  create: {
    body: Joi.object({
      travel_destination_id: id.required(),
      name: Joi.string().trim().max(255).required(),
      description: optionalText,
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null),
      thumbnail: Joi.string().trim().uri().allow(null, ''),
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
      thumbnail: Joi.string().trim().uri().allow(null, ''),
    }).min(1),
  },
};

