const blogModel = require('../models/blog.model');
const blogCommentModel = require('../models/blogComment.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class BlogCommentService {
  async list(blogId, query = {}) {
    await this.ensureBlogExists(blogId);
    return blogCommentModel.findApprovedByBlog(blogId, query);
  }

  async create(blogId, userId, payload) {
    await this.ensureBlogExists(blogId);
    const parentCommentId = payload.parent_comment_id || null;

    if (parentCommentId) {
      await this.ensureParentCommentExists(blogId, parentCommentId);
    }

    return blogCommentModel.create({
      blogId,
      userId,
      parentCommentId,
      content: this.getContent(payload),
      status: 'approved',
    });
  }

  async createReply(blogId, parentCommentId, userId, payload) {
    await this.ensureBlogExists(blogId);
    await this.ensureParentCommentExists(blogId, parentCommentId);

    return blogCommentModel.create({
      blogId,
      userId,
      parentCommentId,
      content: this.getContent(payload),
      status: 'approved',
    });
  }

  async update(blogId, commentId, user, payload) {
    await this.ensureBlogExists(blogId);

    const comment = await blogCommentModel.findActiveByIdAndBlog(commentId, blogId);
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (user.role !== 'admin' && Number(comment.user_id) !== Number(user.sub)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own comment');
    }

    return blogCommentModel.update(commentId, blogId, {
      content: this.getContent(payload),
    });
  }

  async remove(blogId, commentId, user) {
    await this.ensureBlogExists(blogId);

    const comment = await blogCommentModel.findActiveByIdAndBlog(commentId, blogId);
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (user.role !== 'admin' && Number(comment.user_id) !== Number(user.sub)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own comment');
    }

    return blogCommentModel.softDelete(commentId, blogId);
  }

  async ensureBlogExists(blogId) {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }
  }

  async ensureParentCommentExists(blogId, parentCommentId) {
    const parentComment = await blogCommentModel.findActiveParentByIdAndBlog(parentCommentId, blogId);
    if (!parentComment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Parent comment not found');
    }
  }

  getContent(payload) {
    return payload.content !== undefined ? payload.content : payload.comment;
  }
}

module.exports = new BlogCommentService();
