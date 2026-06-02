const Joi = require('joi');

const id = Joi.number().integer().positive();
const optionalText = Joi.string().trim().allow(null, '');
const audioFile = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/view360-audio/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');

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
      audio_file: audioFile,
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
      audio_file: audioFile,
      language: Joi.string().trim().max(50),
      order_index: Joi.number().integer().min(0).allow(null),
    }).min(1),
  },
};

