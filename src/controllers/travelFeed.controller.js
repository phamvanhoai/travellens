const travelFeedService = require('../services/travelFeed.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');

const adminList = asyncHandler(async (req, res) => {
  const result = await travelFeedService.listForAdmin(req.query);
  response.success(res, result, 'Travel posts retrieved successfully');
});

const adminRemove = asyncHandler(async (req, res) => {
  const result = await travelFeedService.removeForAdmin(req.params.postId);
  response.success(res, result, 'Travel post deleted successfully');
});

const adminListComments = asyncHandler(async (req, res) => {
  const result = await travelFeedService.listCommentsForAdmin(req.query);
  response.success(res, result, 'Travel post comments retrieved successfully');
});

const adminRemoveComment = asyncHandler(async (req, res) => {
  const result = await travelFeedService.removeCommentForAdmin(req.params.commentId);
  response.success(res, result, 'Travel post comment deleted successfully');
});

const adminListReports = asyncHandler(async (req, res) => {
  const result = await travelFeedService.listReportsForAdmin(req.query);
  response.success(res, result, 'Travel post reports retrieved successfully');
});

const adminReviewReport = asyncHandler(async (req, res) => {
  const result = await travelFeedService.reviewReportForAdmin(req.params.reportId, req.body, req.user.sub);
  response.success(res, result, 'Travel post report reviewed successfully');
});

const adminDeleteViolatedPost = asyncHandler(async (req, res) => {
  const result = await travelFeedService.deleteViolatedPostForAdmin(req.params.reportId, req.user.sub);
  response.success(res, result, 'Violated travel post deleted successfully');
});

const list = asyncHandler(async (req, res) => {
  const result = await travelFeedService.list(req.user ? req.user.sub : null, req.query);
  response.success(res, result, 'Travel feed retrieved successfully');
});

const create = asyncHandler(async (req, res) => {
  const result = await travelFeedService.create(req.user.sub, req.body, req.files || []);
  response.success(res, result, 'Travel post created successfully', 201);
});

const likePost = asyncHandler(async (req, res) => {
  const result = await travelFeedService.likePost(req.user.sub, req.params.postId);
  response.success(res, result, result.changed ? 'Travel post liked successfully' : 'Travel post already liked');
});

const unlikePost = asyncHandler(async (req, res) => {
  const result = await travelFeedService.unlikePost(req.user.sub, req.params.postId);
  response.success(res, result, result.changed ? 'Travel post unliked successfully' : 'Travel post was not liked');
});

const reportPost = asyncHandler(async (req, res) => {
  const result = await travelFeedService.reportPost(req.user.sub, req.params.postId, req.body);
  response.success(res, result, 'Travel post reported successfully', 201);
});

const updateReport = asyncHandler(async (req, res) => {
  const result = await travelFeedService.updateReport(req.user.sub, req.params.postId, req.body);
  response.success(res, result, 'Travel post report updated successfully');
});

const listComments = asyncHandler(async (req, res) => {
  const result = await travelFeedService.listComments(req.user.sub, req.params.postId, req.query);
  response.success(res, result, 'Travel post comments retrieved successfully');
});

const createComment = asyncHandler(async (req, res) => {
  const result = await travelFeedService.createComment(req.user.sub, req.params.postId, req.body);
  response.success(res, result, 'Comment created successfully', 201);
});

const updateComment = asyncHandler(async (req, res) => {
  const result = await travelFeedService.updateComment(req.user.sub, req.params.commentId, req.body);
  response.success(res, result, 'Comment updated successfully');
});

const deleteComment = asyncHandler(async (req, res) => {
  const result = await travelFeedService.deleteComment(req.user.sub, req.params.commentId);
  response.success(res, result, 'Comment deleted successfully');
});

const sharePost = asyncHandler(async (req, res) => {
  const result = await travelFeedService.sharePost(req.user.sub, req.params.postId, req.body, req);
  response.success(res, result, 'Share tracked successfully', 201);
});

const sharePreview = asyncHandler(async (req, res) => {
  const html = await travelFeedService.getSharePreview(req.params.postId, req);
  res.type('html').send(html);
});

const blockUser = asyncHandler(async (req, res) => {
  const result = await travelFeedService.blockUser(req.user.sub, req.params.userId);
  response.success(res, result, result.changed ? 'User blocked successfully' : 'User already blocked');
});

const unblockUser = asyncHandler(async (req, res) => {
  const result = await travelFeedService.unblockUser(req.user.sub, req.params.userId);
  response.success(res, result, result.changed ? 'User unblocked successfully' : 'User was not blocked');
});

const listBlockedUsers = asyncHandler(async (req, res) => {
  const result = await travelFeedService.listBlockedUsers(req.user.sub, req.query);
  response.success(res, result, 'Blocked users retrieved successfully');
});

const getBlockStatus = asyncHandler(async (req, res) => {
  const result = await travelFeedService.getBlockStatus(req.user.sub, req.params.userId);
  response.success(res, result, 'Block status retrieved successfully');
});

module.exports = {
  adminList,
  adminRemove,
  adminListComments,
  adminRemoveComment,
  adminListReports,
  adminReviewReport,
  adminDeleteViolatedPost,
  list,
  create,
  likePost,
  unlikePost,
  reportPost,
  updateReport,
  listComments,
  createComment,
  updateComment,
  deleteComment,
  sharePost,
  sharePreview,
  blockUser,
  unblockUser,
  listBlockedUsers,
  getBlockStatus,
};
