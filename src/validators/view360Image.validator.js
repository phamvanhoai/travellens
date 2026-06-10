const Joi = require('joi');

const id = Joi.number().integer().positive();
const imageFile = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/view360-images/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
});

module.exports = {
  viewParam: {
    params: Joi.object({
      viewId: id.required(),
    }),
  },

  imageParam: {
    params: Joi.object({
      imageId: id.required(),
    }),
  },

  create: {
    params: Joi.object({
      viewId: id.required(),
    }),
    body: Joi.object({
      image_file: imageFile.required(),
      order_index: Joi.number().integer().min(0).allow(null),
    }),
  },

  update: {
    params: Joi.object({
      imageId: id.required(),
    }),
    body: Joi.object({
      image_file: imageFile,
      order_index: Joi.number().integer().min(0).allow(null),
    }).min(1),
  },
};

