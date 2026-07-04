const Joi = require('joi');

const id = Joi.number().integer().positive();
const fullNamePattern = /^[\p{L}\p{N}]+(?:\s+[\p{L}\p{N}]+)*$/u;
const fullNameMessage = 'Name must use letters, numbers, and spaces only';
const vietnamPhonePattern = /^0(?:3|5|7|8|9)\d{8}$/;
const avatarUrl = Joi.string().trim().custom((value, helpers) => {
  if (!value || value.startsWith('/public/users/')) {
    return value;
  }

  const { error } = Joi.string().uri().validate(value);
  if (error) {
    return helpers.error('string.uri');
  }

  return value;
}).allow(null, '');
const passwordNotBlank = (value, helpers) => {
  if (!value.trim()) {
    return helpers.message('Password must not contain only spaces');
  }

  return value;
};

module.exports = {
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      role: Joi.string().trim().valid('admin', 'staff', 'customer'),
      status: Joi.string().trim().max(50).allow(''),
      sortBy: Joi.string().valid('user_id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at').default('created_at'),
      sortOrder: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
    }),
  },

  customerLookup: {
    query: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
    }),
  },

  create: {
    body: Joi.object({
      name: Joi.string().trim().max(150).pattern(fullNamePattern).required().messages({
        'string.base': fullNameMessage,
        'string.empty': fullNameMessage,
        'string.max': 'Name must not exceed 150 characters',
        'string.pattern.base': fullNameMessage,
        'any.required': 'Name is required',
      }),
      email: Joi.string().trim().lowercase().email().required(),
      password: Joi.string().trim().min(6).custom(passwordNotBlank).allow('', null).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 6 characters',
      }),
      role: Joi.string().trim().valid('admin', 'staff', 'customer').required(),
      status: Joi.string().trim().valid('active', 'inactive', 'pending').required(),
      phone: Joi.string().trim().pattern(vietnamPhonePattern).allow(null, '').messages({
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid Vietnamese mobile number with 10 digits, for example: 0901234567',
      }),
      avatar_url: avatarUrl,
    }),
  },

  update: {
    params: Joi.object({
      id: id.required(),
    }),
    body: Joi.object({
      name: Joi.string().trim().max(150).pattern(fullNamePattern).messages({
        'string.base': fullNameMessage,
        'string.empty': fullNameMessage,
        'string.max': 'Name must not exceed 150 characters',
        'string.pattern.base': fullNameMessage,
      }),
      email: Joi.string().trim().lowercase().email(),
      password: Joi.string().min(6).custom(passwordNotBlank).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 6 characters',
      }),
      role: Joi.string().trim().valid('admin', 'staff', 'customer'),
      status: Joi.string().trim().valid('active', 'inactive', 'pending'),
      phone: Joi.string().trim().pattern(vietnamPhonePattern).allow(null, '').messages({
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid Vietnamese mobile number with 10 digits, for example: 0901234567',
      }),
      avatar_url: avatarUrl,
    }).min(1).unknown(false).messages({
      'object.min': 'Please provide at least one field to update',
      'object.unknown': '{{#label}} cannot be updated',
    }),
    options: {
      stripUnknown: false,
    },
  },
};
