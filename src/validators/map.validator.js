const Joi = require('joi');

const id = Joi.number().integer().positive();
const updateMessages = {
  'object.min': 'At least one map field is required',
  'object.unknown': '{{#label}} is not allowed',
};

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      location_id: id,
    }),
  },
  travel: {
    query: Joi.object({
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180),
      radius: Joi.number().positive().max(500),
      category: Joi.string().trim().allow(''),
      keyword: Joi.string().trim().allow(''),
    }).and('lat', 'lng', 'radius'),
  },
  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      title: Joi.string().trim().max(255).messages({
        'string.empty': 'Title cannot be empty',
        'string.max': 'Title must be less than or equal to 255 characters',
      }),
      description: Joi.string().trim().allow(null, ''),
      map_file: Joi.string().trim().messages({
        'string.empty': 'Map file cannot be empty',
      }),
      display_order: Joi.number().integer().min(0).allow(null).messages({
        'number.base': 'Display order must be a number',
        'number.integer': 'Display order must be an integer',
        'number.min': 'Display order must be greater than or equal to 0',
      }),
      location_id: Joi.forbidden().messages({
        'any.unknown': 'Location relationship cannot be changed',
      }),
    }).min(1).unknown(false).messages(updateMessages),
  },
};
