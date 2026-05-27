const Joi = require('joi');

const fullNamePattern = /^[\p{L}]+(?:\s+[\p{L}]+)+$/u;
const fullNameMessage = 'Name must contain at least 2 words and use letters/spaces only, for example: Nguyen Van A or Le Minh';
const vietnamPhonePattern = /^0(?:3|5|7|8|9)\d{8}$/;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const validateDateOfBirth = (value, helpers) => {
  if (!dateOnlyPattern.test(value)) {
    return helpers.message('Date of birth must use YYYY-MM-DD format, for example: 1998-05-20');
  }

  const [year, month, day] = value.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const isRealDate = birthDate.getFullYear() === year
    && birthDate.getMonth() === month - 1
    && birthDate.getDate() === day;

  if (!isRealDate) {
    return helpers.message('Date of birth must be a real date, for example: 1998-05-20');
  }

  const minDate = new Date(1900, 0, 1);
  if (birthDate < minDate) {
    return helpers.message('Date of birth must not be before 1900-01-01');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (birthDate > today) {
    return helpers.message('Date of birth cannot be greater than today');
  }

  const minAllowedBirthDate = new Date(today);
  minAllowedBirthDate.setFullYear(minAllowedBirthDate.getFullYear() - 16);
  if (birthDate > minAllowedBirthDate) {
    return helpers.message('User must be at least 16 years old');
  }

  return value;
};

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
      name: Joi.string().trim().max(30).pattern(fullNamePattern).messages({
        'string.base': fullNameMessage,
        'string.empty': fullNameMessage,
        'string.max': 'Name must not exceed 30 characters',
        'string.pattern.base': fullNameMessage,
      }),
      profile_info: Joi.string().trim().min(1).max(500).allow(null, '').messages({
        'string.base': 'Profile info must be a string',
        'string.min': 'Profile info must contain at least 1 character if provided',
        'string.max': 'Profile info must not exceed 500 characters',
      }),
      avatar_url: Joi.string().trim().max(500).uri({ scheme: ['http', 'https'] }).allow(null, '').messages({
        'string.base': 'Avatar URL must be a string',
        'string.max': 'Avatar URL must not exceed 500 characters',
        'string.uri': 'Avatar URL must be a valid http:// or https:// URL, for example: https://example.com/avatar.png',
        'string.uriCustomScheme': 'Avatar URL must start with http:// or https://',
      }),
      phone: Joi.string().trim().pattern(vietnamPhonePattern).allow(null, '').messages({
        'string.base': 'Phone must be a string',
        'string.pattern.base': 'Phone must be a valid Vietnamese mobile number with 10 digits, for example: 0901234567',
      }),
      date_of_birth: Joi.string().trim().custom(validateDateOfBirth).allow(null).messages({
        'string.base': 'Date of birth must be a date string in YYYY-MM-DD format, for example: 1998-05-20',
        'string.empty': 'Date of birth must use YYYY-MM-DD format or null',
      }),
      gender: Joi.string().trim().valid('male', 'female', 'other').allow(null, '').messages({
        'any.only': 'Gender must be one of: male, female, other',
        'string.base': 'Gender must be a string',
      }),
      address: Joi.string().trim().min(1).max(255).allow(null, '').messages({
        'string.base': 'Address must be a string',
        'string.min': 'Address must contain at least 1 character if provided',
        'string.max': 'Address must not exceed 255 characters',
      }),
    }).min(1).unknown(false).messages({
      'object.min': 'Please provide at least one field to update',
      'object.unknown': '{{#label}} cannot be updated in profile',
    }),
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
  verifyEmail: {
    body: Joi.object({
      email: Joi.string().trim().lowercase().email().required(),
      otp: Joi.string().trim().length(6).required(),
    }),
  },
};
