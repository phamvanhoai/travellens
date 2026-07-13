const travelPostModel = require('../models/travelPost.model');
const userBlockModel = require('../models/userBlock.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const configuredShareCooldown = Number(process.env.TRAVEL_POST_SHARE_COUNT_COOLDOWN_MINUTES || 5);
const SHARE_COOLDOWN_MINUTES = Number.isFinite(configuredShareCooldown) && configuredShareCooldown >= 0
  ? configuredShareCooldown
  : 5;

const trimTrailingSlash = (value) => String(value || '').replace(/\/+$/, '');

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ');

const truncate = (value, maxLength) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 3).trim()}...`;
};

const buildFrontendPostUrl = (postId) => {
  const template = process.env.TRAVEL_POST_PUBLIC_URL_TEMPLATE;

  if (template) {
    return template
      .replace(':postId', postId)
      .replace('{postId}', postId);
  }

  const clientUrl = trimTrailingSlash(process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173');
  return `${clientUrl}/travel-feed/${postId}`;
};

const buildRequestOrigin = (req) => {
  const configuredOrigin = process.env.API_PUBLIC_URL || process.env.APP_URL;

  if (configuredOrigin) {
    return trimTrailingSlash(configuredOrigin);
  }

  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  return `${protocol}://${req.get('host')}`;
};

const buildSharePreviewUrl = (postId, req) => {
  const template = process.env.TRAVEL_POST_SHARE_PREVIEW_URL_TEMPLATE;

  if (template) {
    return template
      .replace(':postId', postId)
      .replace('{postId}', postId);
  }

  return `${buildRequestOrigin(req)}/api/travel-feed/${postId}/share-preview`;
};

const buildShareUrl = (platform, publicUrl) => {
  const encodedUrl = encodeURIComponent(publicUrl);

  if (platform === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }

  if (platform === 'zalo') {
    return `https://zalo.me/share?u=${encodedUrl}`;
  }

  return publicUrl;
};

const isPublicShareUrl = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    return parsed.protocol === 'https:'
      && hostname !== 'localhost'
      && hostname !== '127.0.0.1'
      && hostname !== '0.0.0.0'
      && !hostname.endsWith('.local');
  } catch (error) {
    return false;
  }
};

const toAbsoluteUrl = (url, origin) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${origin}${url}`;
  return `${origin}/${url}`;
};

const assertCanInteractWithUser = async (userId, targetUserId, executor) => {
  if (Number(userId) === Number(targetUserId)) return;

  const hasBlock = await userBlockModel.hasEitherBlock(userId, targetUserId, executor);

  if (hasBlock) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot interact with this user');
  }
};

class TravelFeedService {
  async list(userId, query = {}) {
    const result = await travelPostModel.listFeed(query, userId);

    return {
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  async create(userId, payload = {}, files = []) {
    const content = typeof payload.content === 'string' ? payload.content.trim() : '';
    const photos = files.filter((file) => file.url);

    if (!content && !photos.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Post content or at least one photo is required');
    }

    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      let destinationId = payload.destination_id ? Number(payload.destination_id) : null;
      const locationId = payload.location_id ? Number(payload.location_id) : null;

      if (locationId) {
        const location = await travelPostModel.findActiveLocation(locationId, client);

        if (!location) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
        }

        if (destinationId && Number(location.destination_id) !== destinationId) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Location does not belong to the selected destination');
        }

        destinationId = Number(location.destination_id);
      }

      if (destinationId) {
        const destination = await travelPostModel.findActiveDestination(destinationId, client);

        if (!destination) {
          throw new ApiError(httpStatus.NOT_FOUND, 'Destination not found');
        }
      }

      const post = await travelPostModel.createPost({
        user_id: userId,
        content,
        destination_id: destinationId,
        location_id: locationId,
      }, client);

      await travelPostModel.addPhotos(post.post_id, photos, client);

      const created = await travelPostModel.findFeedPostById(post.post_id, userId, client);

      await client.query('COMMIT');

      return created;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async likePost(userId, postId) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findLikeablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      const like = await travelPostModel.addLike(postId, userId, client);

      if (like) {
        await travelPostModel.incrementLikeCount(postId, client);
      }

      const updatedPost = await travelPostModel.findFeedPostById(postId, userId, client);

      await client.query('COMMIT');

      return {
        liked: true,
        changed: Boolean(like),
        post: updatedPost,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async unlikePost(userId, postId) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findLikeablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      const like = await travelPostModel.removeLike(postId, userId, client);

      if (like) {
        await travelPostModel.decrementLikeCount(postId, client);
      }

      const updatedPost = await travelPostModel.findFeedPostById(postId, userId, client);

      await client.query('COMMIT');

      return {
        liked: false,
        changed: Boolean(like),
        post: updatedPost,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async reportPost(userId, postId, payload = {}) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findReportablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      if (Number(post.user_id) === Number(userId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You cannot report your own post');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      const report = await travelPostModel.createReport(postId, userId, payload, client);

      if (!report) {
        throw new ApiError(httpStatus.CONFLICT, 'You have already reported this post');
      }

      await travelPostModel.incrementReportCount(postId, client);

      await client.query('COMMIT');

      return report;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateReport(userId, postId, payload = {}) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findReportablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      const existingReport = await travelPostModel.findReportByPostAndUser(postId, userId, client);

      if (!existingReport) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post report not found');
      }

      if (existingReport.status !== 'pending') {
        throw new ApiError(httpStatus.CONFLICT, 'Reviewed reports cannot be updated');
      }

      const report = await travelPostModel.updateReport(postId, userId, payload, client);

      await client.query('COMMIT');

      return report;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async listComments(userId, postId, query = {}) {
    const post = await travelPostModel.findLikeablePostById(postId);

    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
    }

    await assertCanInteractWithUser(userId, post.user_id);

    const result = await travelPostModel.listComments(postId, query, userId);

    return {
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  async createComment(userId, postId, payload = {}) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findLikeablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      if (payload.parent_comment_id) {
        const parentComment = await travelPostModel.findActiveCommentById(payload.parent_comment_id, client);

        if (!parentComment || Number(parentComment.post_id) !== Number(postId)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Parent comment not found in this post');
        }

        await assertCanInteractWithUser(userId, parentComment.user_id, client);
      }

      const comment = await travelPostModel.createComment(postId, userId, payload, client);
      await travelPostModel.incrementCommentCount(postId, client);

      const created = await travelPostModel.findCommentWithAuthor(comment.comment_id, client);

      await client.query('COMMIT');

      return created;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateComment(userId, commentId, payload = {}) {
    const comment = await travelPostModel.findActiveCommentById(commentId);

    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (Number(comment.user_id) !== Number(userId)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own comment');
    }

    await travelPostModel.updateComment(commentId, payload.content);

    return travelPostModel.findCommentWithAuthor(commentId);
  }

  async deleteComment(userId, commentId) {
    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const comment = await travelPostModel.findActiveCommentById(commentId, client);

      if (!comment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
      }

      if (Number(comment.user_id) !== Number(userId)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own comment');
      }

      const deleted = await travelPostModel.softDeleteComment(commentId, client);

      if (deleted) {
        await travelPostModel.decrementCommentCount(comment.post_id, client);
      }

      await client.query('COMMIT');

      return {
        deleted: true,
        comment_id: Number(commentId),
        post_id: comment.post_id,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async sharePost(userId, postId, payload = {}, req) {
    const platform = payload.platform;
    const publicUrl = buildSharePreviewUrl(postId, req);
    const frontendUrl = buildFrontendPostUrl(postId);

    if (['facebook', 'zalo'].includes(platform) && !isPublicShareUrl(publicUrl)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Facebook and Zalo require a public HTTPS share preview URL. Configure API_PUBLIC_URL or TRAVEL_POST_SHARE_PREVIEW_URL_TEMPLATE.'
      );
    }

    const client = await travelPostModel.getClient();

    try {
      await client.query('BEGIN');

      const post = await travelPostModel.findLikeablePostById(postId, client);

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
      }

      await assertCanInteractWithUser(userId, post.user_id, client);

      const hasRecentShare = SHARE_COOLDOWN_MINUTES > 0
        ? await travelPostModel.hasRecentCountedShare(
          postId,
          userId,
          platform,
          SHARE_COOLDOWN_MINUTES,
          client
        )
        : false;
      const counted = !hasRecentShare;

      const share = await travelPostModel.createShare(postId, userId, platform, counted, client);
      let shareCount = null;

      if (counted) {
        const updatedPost = await travelPostModel.incrementShareCount(postId, client);
        shareCount = updatedPost ? updatedPost.share_count : null;
      }

      await client.query('COMMIT');

      return {
        ...share,
        share_count: shareCount,
        count_cooldown_minutes: SHARE_COOLDOWN_MINUTES,
        public_url: publicUrl,
        frontend_url: frontendUrl,
        share_url: buildShareUrl(platform, publicUrl),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async blockUser(userId, targetUserId) {
    if (Number(userId) === Number(targetUserId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot block yourself');
    }

    const targetUser = await userBlockModel.findActiveCustomerById(targetUserId);

    if (!targetUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    const block = await userBlockModel.block(userId, targetUserId);

    return {
      blocked: true,
      changed: Boolean(block),
      user: {
        user_id: targetUser.user_id,
        name: targetUser.name,
        avatar_url: targetUser.avatar_url,
      },
      blocked_at: block ? block.created_at : null,
    };
  }

  async unblockUser(userId, targetUserId) {
    if (Number(userId) === Number(targetUserId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot unblock yourself');
    }

    const targetUser = await userBlockModel.findActiveCustomerById(targetUserId);

    if (!targetUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    const block = await userBlockModel.unblock(userId, targetUserId);
    const status = await userBlockModel.getBlockStatus(userId, targetUserId);

    return {
      blocked: false,
      changed: Boolean(block),
      is_blocked_by_me: status.is_blocked_by_me,
      has_blocked_me: status.has_blocked_me,
      can_interact: !status.is_blocked_by_me && !status.has_blocked_me,
    };
  }

  async listBlockedUsers(userId, query = {}) {
    const result = await userBlockModel.listBlockedUsers(userId, query);

    return {
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  async getBlockStatus(userId, targetUserId) {
    if (Number(userId) === Number(targetUserId)) {
      return {
        is_blocked_by_me: false,
        has_blocked_me: false,
        can_interact: true,
      };
    }

    const targetUser = await userBlockModel.findActiveCustomerById(targetUserId);

    if (!targetUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    const status = await userBlockModel.getBlockStatus(userId, targetUserId);

    return {
      is_blocked_by_me: status.is_blocked_by_me,
      has_blocked_me: status.has_blocked_me,
      can_interact: !status.is_blocked_by_me && !status.has_blocked_me,
    };
  }

  async getSharePreview(postId, req) {
    const post = await travelPostModel.findPublicSharePostById(postId);

    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Travel post not found');
    }

    const origin = buildRequestOrigin(req);
    const frontendUrl = buildFrontendPostUrl(postId);
    const previewUrl = buildSharePreviewUrl(postId, req);
    const authorName = post.author && post.author.name ? post.author.name : 'TravelLens';
    const place = post.location_name || post.destination_name || 'TravelLens';
    const title = `${authorName} shared a travel post`;
    const description = truncate(stripHtml(post.content) || `Explore this travel post on ${place}.`, 180);
    const imageUrl = toAbsoluteUrl(post.cover_image_url, origin);
    const escapedTitle = escapeHtml(title);
    const escapedDescription = escapeHtml(description);
    const escapedPreviewUrl = escapeHtml(previewUrl);
    const escapedFrontendUrl = escapeHtml(frontendUrl);
    const escapedImageUrl = escapeHtml(imageUrl);

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapedTitle}">
    <meta property="og:description" content="${escapedDescription}">
    <meta property="og:url" content="${escapedPreviewUrl}">
    ${imageUrl ? `<meta property="og:image" content="${escapedImageUrl}">` : ''}
    ${imageUrl ? '<meta property="og:image:width" content="1200">' : ''}
    ${imageUrl ? '<meta property="og:image:height" content="630">' : ''}
    <meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${escapedTitle}">
    <meta name="twitter:description" content="${escapedDescription}">
    ${imageUrl ? `<meta name="twitter:image" content="${escapedImageUrl}">` : ''}
    <link rel="canonical" href="${escapedPreviewUrl}">
  </head>
  <body>
    <main>
      <h1>${escapedTitle}</h1>
      <p>${escapedDescription}</p>
      ${imageUrl ? `<img src="${escapedImageUrl}" alt="${escapedTitle}" style="max-width:100%;height:auto;">` : ''}
      <p><a href="${escapedFrontendUrl}">Open travel post</a></p>
    </main>
    <script>
      if (!/facebookexternalhit|Facebot|Twitterbot|Zalo|zalo/i.test(navigator.userAgent)) {
        window.location.replace(${JSON.stringify(frontendUrl)});
      }
    </script>
  </body>
</html>`;
  }
}

module.exports = new TravelFeedService();
