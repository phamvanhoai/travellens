const Joi = require('joi');

const reportReasons = [
  'spam',
  'inappropriate_content',
  'harassment',
  'false_information',
  'scam',
  'other',
];

const sharePlatforms = [
  'facebook',
  'zalo',
  'copy_link',
  'other',
];

module.exports = {
  adminList: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      destination_id: Joi.number().integer().positive(),
      location_id: Joi.number().integer().positive(),
      user_id: Joi.number().integer().positive(),
      status: Joi.string().valid('draft', 'published', 'hidden', 'deleted'),
      visibility: Joi.string().valid('public', 'private'),
      has_reports: Joi.boolean(),
      include_deleted: Joi.boolean().default(false),
      sort: Joi.string().valid('newest', 'oldest', 'popular', 'reported').default('newest'),
    }),
  },

  adminPostAction: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
  },

  adminListComments: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().trim().allow(''),
      post_id: Joi.number().integer().positive(),
      user_id: Joi.number().integer().positive(),
      status: Joi.string().valid('published', 'hidden', 'deleted'),
      has_parent: Joi.boolean(),
      include_deleted: Joi.boolean().default(false),
      sort: Joi.string().valid('newest', 'oldest').default('newest'),
    }),
  },

  adminCommentAction: {
    params: Joi.object({
      commentId: Joi.number().integer().positive().required(),
    }),
  },

  adminListReports: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().trim().allow(''),
      post_id: Joi.number().integer().positive(),
      user_id: Joi.number().integer().positive(),
      reviewed_by: Joi.number().integer().positive(),
      status: Joi.string().valid('pending', 'reviewed', 'dismissed', 'resolved'),
      reason: Joi.string().valid(...reportReasons),
      include_deleted_posts: Joi.boolean().default(true),
      sort: Joi.string().valid('newest', 'oldest').default('newest'),
    }),
  },

  adminReportAction: {
    params: Joi.object({
      reportId: Joi.number().integer().positive().required(),
    }),
  },

  adminReviewReport: {
    params: Joi.object({
      reportId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      status: Joi.string().valid('reviewed', 'dismissed', 'resolved').required(),
    }),
  },

  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      search: Joi.string().trim().allow(''),
      destination_id: Joi.number().integer().positive(),
      location_id: Joi.number().integer().positive(),
      user_id: Joi.number().integer().positive(),
      sort: Joi.string().valid('newest', 'oldest', 'popular').default('newest'),
    }),
  },

  create: {
    body: Joi.object({
      content: Joi.string().trim().max(5000).allow(''),
      destination_id: Joi.number().integer().positive(),
      location_id: Joi.number().integer().positive(),
    }),
  },

  postAction: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
  },

  report: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      reason: Joi.string().valid(...reportReasons).required(),
      description: Joi.when('reason', {
        is: 'other',
        then: Joi.string().trim().min(5).max(1000).required(),
        otherwise: Joi.string().trim().max(1000).allow('', null),
      }),
    }),
  },

  listComments: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  },

  createComment: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      content: Joi.string().trim().min(1).max(2000).required(),
      parent_comment_id: Joi.number().integer().positive(),
    }),
  },

  commentAction: {
    params: Joi.object({
      commentId: Joi.number().integer().positive().required(),
    }),
  },

  updateComment: {
    params: Joi.object({
      commentId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      content: Joi.string().trim().min(1).max(2000).required(),
    }),
  },

  share: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      platform: Joi.string().valid(...sharePlatforms).required(),
    }),
  },

  userAction: {
    params: Joi.object({
      userId: Joi.number().integer().positive().required(),
    }),
  },

  listBlockedUsers: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  },
};
