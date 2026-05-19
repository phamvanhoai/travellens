const Joi = require('joi');

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().max(150).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('admin', 'staff', 'user').default('user'),
      profile_info: Joi.string().allow(null, ''),
      avatar_url: Joi.string().uri().allow(null, ''),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  googleLogin: {
    body: Joi.object({
      email: Joi.string().email().required(),
      google_id: Joi.string().required(),
      name: Joi.string().allow(''),
      avatar_url: Joi.string().uri().allow(null, ''),
    }),
  },
};

