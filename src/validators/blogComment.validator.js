const Joi = require('joi');

const id = Joi.number().integer().positive();
const content = Joi.string().trim().min(1).max(2000);

const contentOnlyBody = Joi.object({
  content,
  comment: content,
}).or('content', 'comment');

const createBody = Joi.object({
  content,
  comment: content,
  parent_comment_id: id,
}).or('content', 'comment');

module.exports = {
  list: {
    params: Joi.object({
      blogId: id.required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  },

  create: {
    params: Joi.object({
      blogId: id.required(),
    }),
    body: createBody,
  },

  createReply: {
    params: Joi.object({
      blogId: id.required(),
      commentId: id.required(),
    }),
    body: Joi.object({
      content,
      comment: content,
    }).or('content', 'comment'),
  },

  update: {
    params: Joi.object({
      blogId: id.required(),
      commentId: id.required(),
    }),
    body: contentOnlyBody,
  },

  remove: {
    params: Joi.object({
      blogId: id.required(),
      commentId: id.required(),
    }),
  },
};
