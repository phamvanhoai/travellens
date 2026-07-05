const Joi = require('joi');

const idParam = Joi.object({
  id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().pattern(/^\d+:\d+$/)).required(),
});

const blogIdentifierParam = Joi.object({
  idOrSlug: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.string().trim().lowercase().max(255).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  ).required(),
});

const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow(''),
}).unknown(true);

const travelDestinationListQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(8),
  search: Joi.string().trim().allow(''),
  destination_category_id: Joi.number().integer().positive(),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'name').default('created_at'),
  sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
}).unknown(false);

module.exports = {
  idParam,
  blogIdentifierParam,
  paginationQuery,
  travelDestinationListQuery,
};
