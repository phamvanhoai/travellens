const Joi = require('joi');

const idParam = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const memberParam = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});

const tokenParam = Joi.object({
  token: Joi.string().trim().hex().length(64).required(),
});

const listQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow(''),
}).unknown(false);

const create = {
  body: Joi.object({
    booking_id: Joi.number().integer().positive().required(),
    name: Joi.string().trim().min(2).max(150).required(),
    visibility: Joi.string().valid('public', 'private').default('private'),
  }),
};

const updateSettings = {
  params: idParam,
  body: Joi.object({
    name: Joi.string().trim().min(2).max(150),
    visibility: Joi.string().valid('public', 'private'),
  }).min(1),
};

const changeLeader = {
  params: idParam,
  body: Joi.object({
    user_id: Joi.number().integer().positive().required(),
  }),
};

const invite = {
  params: idParam,
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
  }),
};

module.exports = {
  idParam,
  memberParam,
  tokenParam,
  listQuery,
  create,
  updateSettings,
  changeLeader,
  invite,
};
