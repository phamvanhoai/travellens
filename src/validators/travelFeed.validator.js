const Joi = require('joi');

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      destination_id: Joi.number().integer().positive(),
      location_id: Joi.number().integer().positive(),
      user_id: Joi.number().integer().positive(),
      sort: Joi.string().valid('newest', 'oldest', 'popular').default('newest'),
    }),
  },

  create: {
    body: Joi.object({
      content: Joi.string().trim().max(5000).allow(''),
      destination_id: Joi.number().integer().positive(),
      location_id: Joi.number().integer().positive(),
    }),
  },
};
