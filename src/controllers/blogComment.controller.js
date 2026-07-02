const blogCommentService = require('../services/blogComment.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await blogCommentService.list(req.params.blogId, req.query);
    response.success(res, data);
  }),

  create: asyncHandler(async (req, res) => {
    const data = await blogCommentService.create(
      req.params.blogId,
      req.user.sub,
      req.body
    );

    response.success(res, data, 'Comment created successfully', httpStatus.CREATED);
  }),

  createReply: asyncHandler(async (req, res) => {
    const data = await blogCommentService.createReply(
      req.params.blogId,
      req.params.commentId,
      req.user.sub,
      req.body
    );

    response.success(res, data, 'Reply created successfully', httpStatus.CREATED);
  }),

  update: asyncHandler(async (req, res) => {
    const data = await blogCommentService.update(
      req.params.blogId,
      req.params.commentId,
      req.user,
      req.body
    );

    response.success(res, data, 'Comment updated successfully');
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await blogCommentService.remove(
      req.params.blogId,
      req.params.commentId,
      req.user
    );

    response.success(res, data, 'Comment deleted successfully');
  }),
};
