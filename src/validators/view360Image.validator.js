const Joi = require('joi');

const id = Joi.number().integer().positive();

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
      image_file: Joi.string().trim().required(),
      order_index: Joi.number().integer().min(0).allow(null),
    }),
  },

  update: {
    params: Joi.object({
      imageId: id.required(),
    }),
    body: Joi.object({
      image_file: Joi.string().trim(),
      order_index: Joi.number().integer().min(0).allow(null),
    }).min(1),
  },
};

