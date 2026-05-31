const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().trim().allow(null, '');

module.exports = {
  locationParam: {
    params: Joi.object({
      locationId: id.required(),
    }),
  },

  viewParam: {
    params: Joi.object({
      viewId: id.required(),
    }),
  },

  create: {
    params: Joi.object({
      locationId: id.required(),
    }),
    body: Joi.object({
      title: Joi.string().trim().max(255).required(),
      description: optionalText,
      audio_file: optionalText,
      language: Joi.string().trim().max(50).default('vi'),
      order_index: Joi.number().integer().min(0).allow(null),
    }),
  },

  update: {
    params: Joi.object({
      viewId: id.required(),
    }),
    body: Joi.object({
      title: Joi.string().trim().max(255),
      description: optionalText,
      audio_file: optionalText,
      language: Joi.string().trim().max(50),
      order_index: Joi.number().integer().min(0).allow(null),
    }).min(1),
  },
};

