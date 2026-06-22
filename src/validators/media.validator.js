const Joi = require('joi');

const id = Joi.number().integer().positive();

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().trim().allow(''),
      mime_type: Joi.string().trim().max(100),
    }),
  },
  id: {
    params: Joi.object({ id: id.required() }),
  },
  update: {
    params: Joi.object({ id: id.required() }),
    body: Joi.object({
      original_name: Joi.string().trim().min(1).max(255).required(),
    }),
  },
};
