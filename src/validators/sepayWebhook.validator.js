const Joi = require('joi');

module.exports = {
  handle: {
    body: Joi.object({
      id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      gateway: Joi.string().trim().allow(null, ''),
      transactionDate: Joi.alternatives().try(Joi.string(), Joi.date()).allow(null, ''),
      accountNumber: Joi.string().trim().allow(null, ''),
      subAccount: Joi.string().trim().allow(null, ''),
      code: Joi.string().trim().allow(null, ''),
      content: Joi.string().trim().allow(null, ''),
      transferType: Joi.string().trim().valid('in', 'out').required(),
      transferAmount: Joi.number().min(0).required(),
      accumulated: Joi.number().min(0).allow(null),
      referenceCode: Joi.string().trim().allow(null, ''),
    }).unknown(true),
  },
};
