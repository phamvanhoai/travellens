const Joi = require('joi');

module.exports = {
  register: {
    body: Joi.object({
      name: Joi.string().trim().max(150).required(),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().min(6).required(),
      confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password does not match password',
        'any.required': 'Confirm password is required',
      }),
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
  changePassword: {
    body: Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
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
      phone: Joi.string().trim().max(30).allow(null, ''),
      date_of_birth: Joi.date().allow(null),
      gender: Joi.string().trim().max(20).allow(null, ''),
      address: Joi.string().trim().allow(null, ''),
    }).min(1).unknown(false),
    options: {
      stripUnknown: false,
    },
  },
  forgotPassword: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
    }),
  },
  verifyResetCode: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
      code: Joi.string().trim().length(6).required(),
    }),
  },
  resetPassword: {
    body: Joi.object({
      reset_token: Joi.string().trim().required(),
      new_password: Joi.string().min(6).required(),
    }),
  },
};
