const Joi = require('joi');

const id = Joi.number().integer().positive();
const fullNamePattern = /^[\p{L}]+(?:\s+[\p{L}]+)+$/u;
const fullNameMessage = 'Name must contain at least 2 words and use letters/spaces only, for example: Nguyen Van A or Le Minh';
const vietnamPhonePattern = /^0(?:3|5|7|8|9)\d{8}$/;
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
      password: Joi.string().min(6).custom(passwordNotBlank).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
      }),
      role: Joi.string().trim().valid('admin', 'staff', 'customer').required(),
      status: Joi.string().trim().valid('active', 'inactive', 'pending').required(),
      phone: Joi.string().trim().pattern(vietnamPhonePattern).allow(null, '').messages({
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid Vietnamese mobile number with 10 digits, for example: 0901234567',
      }),
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
    }).min(1).unknown(false).messages({
      'object.min': 'Please provide at least one field to update',
      'object.unknown': '{{#label}} cannot be updated',
    }),
    options: {
      stripUnknown: false,
    },
  },
};
