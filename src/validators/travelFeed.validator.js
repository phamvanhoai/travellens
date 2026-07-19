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

const contentMessages = {
  'string.base': 'Content must be text.',
  'string.max': 'Content must be 5000 characters or fewer.',
};

const destinationMessages = {
  'number.base': 'Destination must be a valid id or empty.',
  'number.integer': 'Destination must be a valid id or empty.',
  'number.positive': 'Destination must be a valid id or empty.',
};

const locationMessages = {
  'number.base': 'Location must be a valid id or empty.',
  'number.integer': 'Location must be a valid id or empty.',
  'number.positive': 'Location must be a valid id or empty.',
};

const visibilityMessages = {
  'any.only': 'Visibility must be public or private.',
};

const keepPhotoMessages = {
  'any.invalid': 'Kept photos must be valid photo ids with no duplicates.',
  'array.max': 'Kept photos can contain at most 10 photo ids.',
};

const photoIds = Joi.any().custom((value, helpers) => {
  let rawIds = value;

  if (value === undefined || value === null || value === '') {
    rawIds = [];
  } else if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      rawIds = [];
    } else {
      try {
        const parsed = JSON.parse(trimmed);
        rawIds = Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        rawIds = trimmed.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }
  } else if (!Array.isArray(value)) {
    rawIds = [value];
  }

  const ids = rawIds.map((item) => Number(item));

  if (ids.some((item) => !Number.isInteger(item) || item <= 0)) {
    return helpers.error('any.invalid');
  }

  if (new Set(ids).size !== ids.length) {
    return helpers.error('any.invalid');
  }

  if (ids.length > 10) {
    return helpers.error('array.max');
  }

  return ids;
});

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
      status: Joi.string().valid('pending', 'dismissed', 'resolved'),
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
      status: Joi.string().valid('dismissed').required(),
    }),
  },

  adminRestorePost: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
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

  update: {
    params: Joi.object({
      postId: Joi.number().integer().positive().required(),
    }),
    body: Joi.object({
      content: Joi.string().trim().max(5000).allow('').messages(contentMessages),
      destination_id: Joi.number().integer().positive().allow(null, '').empty('').messages(destinationMessages),
      location_id: Joi.number().integer().positive().allow(null, '').empty('').messages(locationMessages),
      visibility: Joi.string().valid('public', 'private').messages(visibilityMessages),
      keep_photo_ids: photoIds.messages(keepPhotoMessages),
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
