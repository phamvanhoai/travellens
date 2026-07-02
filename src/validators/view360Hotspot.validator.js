const Joi = require('joi');

const id = Joi.number().integer().positive();
const hotspotType = Joi.string().valid('info', 'navigation', 'link', 'location');
const optionalText = Joi.string().trim().allow(null, '');
const targetUrl = Joi.string().trim().uri().allow(null, '');

const hotspotBody = {
  type: hotspotType.default('info'),
  title: Joi.string().trim().max(255).allow(null, ''),
  description: optionalText,
  yaw: Joi.number().min(-360).max(360).required(),
  pitch: Joi.number().min(-90).max(90).required(),
  target_view360_id: id.allow(null),
  target_url: targetUrl,
  order_index: Joi.number().integer().min(0).allow(null).default(0),
  is_active: Joi.boolean().default(true),
};

module.exports = {
  viewParam: {
    params: Joi.object({
      view360Id: id.required(),
    }),
  },

  hotspotParam: {
    params: Joi.object({
      hotspotId: id.required(),
    }),
  },

  create: {
    params: Joi.object({
      view360Id: id.required(),
    }),
    body: Joi.object(hotspotBody),
  },

  update: {
    params: Joi.object({
      hotspotId: id.required(),
    }),
    body: Joi.object({
      ...hotspotBody,
      type: hotspotType,
      yaw: Joi.number().min(-360).max(360),
      pitch: Joi.number().min(-90).max(90),
      order_index: Joi.number().integer().min(0).allow(null),
      is_active: Joi.boolean(),
    }).min(1),
  },
};
