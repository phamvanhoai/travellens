const db = require('../config/db');

const SORT_COLUMNS = {
  newest: 'tp.created_at DESC, tp.post_id DESC',
  oldest: 'tp.created_at ASC, tp.post_id ASC',
  popular: 'tp.like_count DESC, tp.comment_count DESC, tp.created_at DESC, tp.post_id DESC',
};

const buildFeedWhere = (query = {}, viewerId) => {
  const values = [];
  const clauses = [
    "tp.status = 'published'",
    "tp.visibility = 'public'",
    'tp.deleted_at IS NULL',
  ];

  if (query.destination_id) {
    values.push(query.destination_id);
    clauses.push(`tp.destination_id = $${values.length}`);
  }

  if (query.location_id) {
    values.push(query.location_id);
    clauses.push(`tp.location_id = $${values.length}`);
  }

  if (query.user_id) {
    values.push(query.user_id);
    clauses.push(`tp.user_id = $${values.length}`);
  }

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`tp.content ILIKE $${values.length}`);
  }

  if (viewerId) {
    values.push(viewerId);
    clauses.push(`NOT EXISTS (
      SELECT 1
      FROM user_block ub
      WHERE (ub.blocker_id = $${values.length} AND ub.blocked_id = tp.user_id)
         OR (ub.blocker_id = tp.user_id AND ub.blocked_id = $${values.length})
    )`);
  }

  return {
    text: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
};

class TravelPostModel {
  getClient() {
    return db.getClient();
  }

  async listFeed(query = {}, viewerId) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildFeedWhere(query, viewerId);
    const sort = SORT_COLUMNS[query.sort] || SORT_COLUMNS.newest;

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post tp
       ${where.text}`,
      where.values
    );

    const values = [...where.values, viewerId, limit, offset];
    const viewerParam = values.length - 2;
    const limitParam = values.length - 1;
    const offsetParam = values.length;

    const result = await db.query(
      `SELECT
          tp.post_id,
          tp.user_id,
          tp.content,
          tp.destination_id,
          td.name AS destination_name,
          tp.location_id,
          l.name AS location_name,
          tp.status,
          tp.visibility,
          tp.like_count,
          tp.comment_count,
          tp.report_count,
          tp.share_count,
          tp.created_at,
          tp.updated_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'avatar_url', u.avatar_url
          ) AS author,
          COALESCE((
            SELECT json_agg(json_build_object(
              'photo_id', tpp.photo_id,
              'image_url', tpp.image_url,
              'display_order', tpp.display_order,
              'created_at', tpp.created_at
            ) ORDER BY tpp.display_order ASC, tpp.photo_id ASC)
            FROM travel_post_photo tpp
            WHERE tpp.post_id = tp.post_id
              AND tpp.deleted_at IS NULL
          ), '[]'::json) AS photos,
          EXISTS (
            SELECT 1
            FROM travel_post_like tpl
            WHERE tpl.post_id = tp.post_id
              AND tpl.user_id = $${viewerParam}
          ) AS is_liked
       FROM travel_post tp
       JOIN users u ON u.user_id = tp.user_id
       LEFT JOIN travel_destination td
         ON td.destination_id = tp.destination_id
        AND td.deleted_at IS NULL
       LEFT JOIN location l
         ON l.location_id = tp.location_id
        AND l.deleted_at IS NULL
        AND l.is_deleted = FALSE
       ${where.text}
       ORDER BY ${sort}
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      values
    );

    return {
      items: result.rows,
      total: countResult.rows[0].total,
      page,
      limit,
    };
  }

  async findActiveDestination(destinationId, executor = db) {
    const result = await executor.query(
      `SELECT destination_id, name
       FROM travel_destination
       WHERE destination_id = $1
         AND deleted_at IS NULL`,
      [destinationId]
    );

    return result.rows[0] || null;
  }

  async findActiveLocation(locationId, executor = db) {
    const result = await executor.query(
      `SELECT location_id, name, destination_id
       FROM location
       WHERE location_id = $1
         AND deleted_at IS NULL
         AND is_deleted = FALSE`,
      [locationId]
    );

    return result.rows[0] || null;
  }

  async createPost(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO travel_post (
          user_id,
          content,
          destination_id,
          location_id,
          status,
          visibility
       )
       VALUES ($1, $2, $3, $4, 'published', 'public')
       RETURNING *`,
      [
        payload.user_id,
        payload.content || null,
        payload.destination_id || null,
        payload.location_id || null,
      ]
    );

    return result.rows[0];
  }

  async addPhotos(postId, photos = [], executor = db) {
    const created = [];

    for (const [index, photo] of photos.entries()) {
      const result = await executor.query(
        `INSERT INTO travel_post_photo (post_id, image_url, display_order)
         VALUES ($1, $2, $3)
         RETURNING photo_id, post_id, image_url, display_order, created_at`,
        [postId, photo.url, index]
      );

      created.push(result.rows[0]);
    }

    return created;
  }

  async findFeedPostById(postId, viewerId, executor = db) {
    const result = await executor.query(
      `SELECT
          tp.post_id,
          tp.user_id,
          tp.content,
          tp.destination_id,
          td.name AS destination_name,
          tp.location_id,
          l.name AS location_name,
          tp.status,
          tp.visibility,
          tp.like_count,
          tp.comment_count,
          tp.report_count,
          tp.share_count,
          tp.created_at,
          tp.updated_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'avatar_url', u.avatar_url
          ) AS author,
          COALESCE((
            SELECT json_agg(json_build_object(
              'photo_id', tpp.photo_id,
              'image_url', tpp.image_url,
              'display_order', tpp.display_order,
              'created_at', tpp.created_at
            ) ORDER BY tpp.display_order ASC, tpp.photo_id ASC)
            FROM travel_post_photo tpp
            WHERE tpp.post_id = tp.post_id
              AND tpp.deleted_at IS NULL
          ), '[]'::json) AS photos,
          EXISTS (
            SELECT 1
            FROM travel_post_like tpl
            WHERE tpl.post_id = tp.post_id
              AND tpl.user_id = $2
          ) AS is_liked
       FROM travel_post tp
       JOIN users u ON u.user_id = tp.user_id
       LEFT JOIN travel_destination td
         ON td.destination_id = tp.destination_id
        AND td.deleted_at IS NULL
       LEFT JOIN location l
         ON l.location_id = tp.location_id
        AND l.deleted_at IS NULL
        AND l.is_deleted = FALSE
       WHERE tp.post_id = $1
         AND tp.deleted_at IS NULL`,
      [postId, viewerId]
    );

    return result.rows[0] || null;
  }

  async findPublicSharePostById(postId, executor = db) {
    const result = await executor.query(
      `SELECT
          tp.post_id,
          tp.user_id,
          tp.content,
          tp.destination_id,
          td.name AS destination_name,
          tp.location_id,
          l.name AS location_name,
          tp.created_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'avatar_url', u.avatar_url
          ) AS author,
          (
            SELECT tpp.image_url
            FROM travel_post_photo tpp
            WHERE tpp.post_id = tp.post_id
              AND tpp.deleted_at IS NULL
            ORDER BY tpp.display_order ASC, tpp.photo_id ASC
            LIMIT 1
          ) AS cover_image_url
       FROM travel_post tp
       JOIN users u ON u.user_id = tp.user_id
       LEFT JOIN travel_destination td
         ON td.destination_id = tp.destination_id
        AND td.deleted_at IS NULL
       LEFT JOIN location l
         ON l.location_id = tp.location_id
        AND l.deleted_at IS NULL
        AND l.is_deleted = FALSE
       WHERE tp.post_id = $1
         AND tp.status = 'published'
         AND tp.visibility = 'public'
         AND tp.deleted_at IS NULL`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async findLikeablePostById(postId, executor = db) {
    const result = await executor.query(
      `SELECT post_id, user_id
       FROM travel_post
       WHERE post_id = $1
         AND status = 'published'
         AND visibility = 'public'
         AND deleted_at IS NULL`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async findReportablePostById(postId, executor = db) {
    const result = await executor.query(
      `SELECT post_id, user_id
       FROM travel_post
       WHERE post_id = $1
         AND status = 'published'
         AND visibility = 'public'
         AND deleted_at IS NULL`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async listComments(postId, query = {}, viewerId, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;

    const values = [postId];
    const blockFilter = viewerId
      ? `AND NOT EXISTS (
          SELECT 1
          FROM user_block ub
          WHERE (ub.blocker_id = $2 AND ub.blocked_id = tpc.user_id)
             OR (ub.blocker_id = tpc.user_id AND ub.blocked_id = $2)
        )`
      : '';

    if (viewerId) {
      values.push(viewerId);
    }

    const limitParam = values.length + 1;
    const offsetParam = values.length + 2;

    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post_comment tpc
       WHERE tpc.post_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL
         ${blockFilter}`,
      values
    );

    const result = await executor.query(
      `SELECT
          tpc.comment_id,
          tpc.post_id,
          tpc.user_id,
          tpc.parent_comment_id,
          tpc.content,
          tpc.status,
          tpc.created_at,
          tpc.updated_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'avatar_url', u.avatar_url
          ) AS author
       FROM travel_post_comment tpc
       JOIN users u ON u.user_id = tpc.user_id
       WHERE tpc.post_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL
         ${blockFilter}
       ORDER BY tpc.created_at ASC, tpc.comment_id ASC
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...values, limit, offset]
    );

    return {
      items: result.rows,
      total: countResult.rows[0].total,
      page,
      limit,
    };
  }

  async findActiveCommentById(commentId, executor = db) {
    const result = await executor.query(
      `SELECT comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at
       FROM travel_post_comment
       WHERE comment_id = $1
         AND status = 'published'
         AND deleted_at IS NULL`,
      [commentId]
    );

    return result.rows[0] || null;
  }

  async createComment(postId, userId, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO travel_post_comment (post_id, user_id, parent_comment_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at`,
      [postId, userId, payload.parent_comment_id || null, payload.content]
    );

    return result.rows[0];
  }

  async findCommentWithAuthor(commentId, executor = db) {
    const result = await executor.query(
      `SELECT
          tpc.comment_id,
          tpc.post_id,
          tpc.user_id,
          tpc.parent_comment_id,
          tpc.content,
          tpc.status,
          tpc.created_at,
          tpc.updated_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'avatar_url', u.avatar_url
          ) AS author
       FROM travel_post_comment tpc
       JOIN users u ON u.user_id = tpc.user_id
       WHERE tpc.comment_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL`,
      [commentId]
    );

    return result.rows[0] || null;
  }

  async updateComment(commentId, content, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_comment
       SET content = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE comment_id = $1
         AND status = 'published'
         AND deleted_at IS NULL
       RETURNING comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at`,
      [commentId, content]
    );

    return result.rows[0] || null;
  }

  async softDeleteComment(commentId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_comment
       SET status = 'deleted',
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE comment_id = $1
         AND status = 'published'
         AND deleted_at IS NULL
       RETURNING comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at`,
      [commentId]
    );

    return result.rows[0] || null;
  }

  async incrementCommentCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET comment_count = comment_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING comment_count`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async decrementCommentCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET comment_count = GREATEST(comment_count - 1, 0),
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING comment_count`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async addLike(postId, userId, executor = db) {
    const result = await executor.query(
      `INSERT INTO travel_post_like (post_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING post_id, user_id, created_at`,
      [postId, userId]
    );

    return result.rows[0] || null;
  }

  async removeLike(postId, userId, executor = db) {
    const result = await executor.query(
      `DELETE FROM travel_post_like
       WHERE post_id = $1
         AND user_id = $2
       RETURNING post_id, user_id`,
      [postId, userId]
    );

    return result.rows[0] || null;
  }

  async incrementLikeCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET like_count = like_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING like_count`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async decrementLikeCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET like_count = GREATEST(like_count - 1, 0),
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING like_count`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async createReport(postId, userId, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO travel_post_report (post_id, user_id, reason, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (post_id, user_id) DO NOTHING
       RETURNING report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at`,
      [postId, userId, payload.reason, payload.description || null]
    );

    return result.rows[0] || null;
  }

  async findReportByPostAndUser(postId, userId, executor = db) {
    const result = await executor.query(
      `SELECT report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at
       FROM travel_post_report
       WHERE post_id = $1
         AND user_id = $2`,
      [postId, userId]
    );

    return result.rows[0] || null;
  }

  async updateReport(postId, userId, payload, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_report
       SET reason = $3,
           description = $4
       WHERE post_id = $1
         AND user_id = $2
         AND status = 'pending'
       RETURNING report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at`,
      [postId, userId, payload.reason, payload.description || null]
    );

    return result.rows[0] || null;
  }

  async incrementReportCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET report_count = report_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING report_count`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async hasRecentCountedShare(postId, userId, platform, cooldownMinutes, executor = db) {
    const result = await executor.query(
      `SELECT 1
       FROM travel_post_share
       WHERE post_id = $1
         AND user_id = $2
         AND platform = $3
         AND counted = TRUE
         AND created_at >= CURRENT_TIMESTAMP - make_interval(mins => $4::int)
       LIMIT 1`,
      [postId, userId, platform, cooldownMinutes]
    );

    return result.rows.length > 0;
  }

  async createShare(postId, userId, platform, counted, executor = db) {
    const result = await executor.query(
      `INSERT INTO travel_post_share (post_id, user_id, platform, counted)
       VALUES ($1, $2, $3, $4)
       RETURNING share_id, post_id, user_id, platform, counted, created_at`,
      [postId, userId, platform, counted]
    );

    return result.rows[0];
  }

  async incrementShareCount(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET share_count = share_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
       RETURNING share_count`,
      [postId]
    );

    return result.rows[0] || null;
  }
}

module.exports = new TravelPostModel();
