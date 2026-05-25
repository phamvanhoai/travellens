const Joi = require('joi');

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().trim().max(150).required(),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().min(6).required(),
      profile_info: Joi.string().trim().allow(null, ''),
      avatar_url: Joi.string().trim().uri().allow(null, ''),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().required(),
    }),
  },
  googleLogin: {
    body: Joi.object({
      id_token: Joi.string().required(),
    }),
  },
  updateProfile: {
    body: Joi.object({
      name: Joi.string().trim().max(150),
      profile_info: Joi.string().trim().allow(null, ''),
      avatar_url: Joi.string().trim().uri().allow(null, ''),
    }).min(1),
  },
};
