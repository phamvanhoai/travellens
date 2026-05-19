const Joi = require('joi');

const idParam = Joi.object({
  id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+:\d+$/)).required(),
});

const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow(''),
}).unknown(true);

module.exports = {
  idParam,
  paginationQuery,
};

