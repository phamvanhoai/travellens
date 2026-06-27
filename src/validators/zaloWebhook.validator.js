const Joi = require('joi');

module.exports = {
  handle: {
    body: Joi.object({
      ok: Joi.boolean(),
      result: Joi.object({
        event_name: Joi.string().required(),
        message: Joi.object({
          from: Joi.object().unknown(true),
          chat: Joi.object({
            id: Joi.string().required(),
            chat_type: Joi.string().valid('PRIVATE', 'GROUP'),
          }).unknown(true),
          text: Joi.string().allow('', null),
          photo: Joi.string().allow('', null),
          caption: Joi.string().allow('', null),
          sticker: Joi.string().allow('', null),
          url: Joi.string().allow('', null),
          voice_url: Joi.string().allow('', null),
          message_id: Joi.string().allow('', null),
          date: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        }).unknown(true),
      }).unknown(true).required(),
    }).unknown(true),
  },
};
