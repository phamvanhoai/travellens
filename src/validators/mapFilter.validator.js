const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  filter: {
    query: Joi.object({
      destination_category_id: id,
      has_view360: Joi.boolean(),
      min_rating: Joi.number().min(0).max(5),
      radius: Joi.number().positive().max(500).when('nearby_only', {
        is: true,
        then: Joi.optional(),
        otherwise: Joi.optional(),
      }),
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180),
      nearby_only: Joi.boolean(),
      popular_only: Joi.boolean(),
    }).and('lat', 'lng').with('radius', ['lat', 'lng']),
  },
};
