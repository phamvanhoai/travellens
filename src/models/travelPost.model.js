const db = require('../config/db');

const SORT_COLUMNS = {
  newest: 'tp.created_at DESC, tp.post_id DESC',
  oldest: 'tp.created_at ASC, tp.post_id ASC',
  popular: 'tp.like_count DESC, tp.comment_count DESC, tp.created_at DESC, tp.post_id DESC',
  reported: 'tp.report_count DESC, tp.created_at DESC, tp.post_id DESC',
};

const COMMENT_SORT_COLUMNS = {
  newest: 'tpc.created_at DESC, tpc.comment_id DESC',
  oldest: 'tpc.created_at ASC, tpc.comment_id ASC',
};

const REPORT_SORT_COLUMNS = {
  newest: 'tpr.created_at DESC, tpr.report_id DESC',
  oldest: 'tpr.created_at ASC, tpr.report_id ASC',
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

const buildAdminWhere = (query = {}) => {
  const values = [];
  const clauses = [];

  if (!query.include_deleted) {
    clauses.push('tp.deleted_at IS NULL');
  }

  if (query.status) {
    values.push(query.status);
    clauses.push(`tp.status = $${values.length}`);
  }

  if (query.visibility) {
    values.push(query.visibility);
    clauses.push(`tp.visibility = $${values.length}`);
  }

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

  if (query.has_reports !== undefined) {
    clauses.push(query.has_reports ? 'tp.report_count > 0' : 'tp.report_count = 0');
  }

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(
      tp.content ILIKE $${values.length}
      OR u.name ILIKE $${values.length}
      OR u.email ILIKE $${values.length}
      OR td.name ILIKE $${values.length}
      OR l.name ILIKE $${values.length}
    )`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

const buildAdminCommentWhere = (query = {}) => {
  const values = [];
  const clauses = [];

  if (!query.include_deleted) {
    clauses.push('tpc.deleted_at IS NULL');
  }

  if (query.post_id) {
    values.push(query.post_id);
    clauses.push(`tpc.post_id = $${values.length}`);
  }

  if (query.user_id) {
    values.push(query.user_id);
    clauses.push(`tpc.user_id = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status);
    clauses.push(`tpc.status = $${values.length}`);
  }

  if (query.has_parent !== undefined) {
    clauses.push(query.has_parent ? 'tpc.parent_comment_id IS NOT NULL' : 'tpc.parent_comment_id IS NULL');
  }

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(
      tpc.content ILIKE $${values.length}
      OR u.name ILIKE $${values.length}
      OR u.email ILIKE $${values.length}
      OR tp.content ILIKE $${values.length}
    )`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

const buildAdminReportWhere = (query = {}) => {
  const values = [];
  const clauses = [];

  if (query.include_deleted_posts === false) {
    clauses.push('tp.deleted_at IS NULL');
  }

  if (query.post_id) {
    values.push(query.post_id);
    clauses.push(`tpr.post_id = $${values.length}`);
  }

  if (query.user_id) {
    values.push(query.user_id);
    clauses.push(`tpr.user_id = $${values.length}`);
  }

  if (query.reviewed_by) {
    values.push(query.reviewed_by);
    clauses.push(`tpr.reviewed_by = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status);
    clauses.push(`tpr.status = $${values.length}`);
  }

  if (query.reason) {
    values.push(query.reason);
    clauses.push(`tpr.reason = $${values.length}`);
  }

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(
      tpr.description ILIKE $${values.length}
      OR reporter.name ILIKE $${values.length}
      OR reporter.email ILIKE $${values.length}
      OR post_author.name ILIKE $${values.length}
      OR post_author.email ILIKE $${values.length}
      OR tp.content ILIKE $${values.length}
    )`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
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

  async listForAdmin(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildAdminWhere(query);
    const sort = SORT_COLUMNS[query.sort] || SORT_COLUMNS.newest;

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post tp
       JOIN users u ON u.user_id = tp.user_id
       LEFT JOIN travel_destination td
         ON td.destination_id = tp.destination_id
       LEFT JOIN location l
         ON l.location_id = tp.location_id
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
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
          tp.deleted_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'email', u.email,
            'avatar_url', u.avatar_url,
            'status', u.status
          ) AS author,
          COALESCE((
            SELECT json_agg(json_build_object(
              'photo_id', tpp.photo_id,
              'image_url', tpp.image_url,
              'display_order', tpp.display_order,
              'created_at', tpp.created_at,
              'deleted_at', tpp.deleted_at
            ) ORDER BY tpp.display_order ASC, tpp.photo_id ASC)
            FROM travel_post_photo tpp
            WHERE tpp.post_id = tp.post_id
              AND tpp.deleted_at IS NULL
          ), '[]'::json) AS photos,
          (
            SELECT COUNT(*)::int
            FROM travel_post_report tpr
            WHERE tpr.post_id = tp.post_id
              AND tpr.status = 'pending'
          ) AS pending_report_count
       FROM travel_post tp
       JOIN users u ON u.user_id = tp.user_id
       LEFT JOIN travel_destination td
         ON td.destination_id = tp.destination_id
       LEFT JOIN location l
         ON l.location_id = tp.location_id
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

  async softDeletePost(postId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post
       SET status = 'deleted',
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
         AND deleted_at IS NULL
       RETURNING
         post_id,
         user_id,
         content,
         destination_id,
         location_id,
         status,
         visibility,
         like_count,
         comment_count,
         report_count,
         share_count,
         created_at,
         updated_at,
         deleted_at`,
      [postId]
    );

    return result.rows[0] || null;
  }

  async listCommentsForAdmin(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildAdminCommentWhere(query);
    const sort = COMMENT_SORT_COLUMNS[query.sort] || COMMENT_SORT_COLUMNS.newest;

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post_comment tpc
       JOIN users u ON u.user_id = tpc.user_id
       JOIN travel_post tp ON tp.post_id = tpc.post_id
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
    const limitParam = values.length - 1;
    const offsetParam = values.length;

    const result = await db.query(
      `SELECT
          tpc.comment_id,
          tpc.post_id,
          tpc.user_id,
          tpc.parent_comment_id,
          tpc.content,
          tpc.status,
          tpc.created_at,
          tpc.updated_at,
          tpc.deleted_at,
          json_build_object(
            'user_id', u.user_id,
            'name', u.name,
            'email', u.email,
            'avatar_url', u.avatar_url,
            'status', u.status
          ) AS author,
          json_build_object(
            'post_id', tp.post_id,
            'content', tp.content,
            'status', tp.status,
            'visibility', tp.visibility,
            'deleted_at', tp.deleted_at
          ) AS post
       FROM travel_post_comment tpc
       JOIN users u ON u.user_id = tpc.user_id
       JOIN travel_post tp ON tp.post_id = tpc.post_id
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

  async softDeleteCommentForAdmin(commentId, executor = db) {
    const result = await executor.query(
      `WITH current_comment AS (
         SELECT comment_id, post_id, status AS from_status
         FROM travel_post_comment
         WHERE comment_id = $1
           AND deleted_at IS NULL
           AND status <> 'deleted'
       )
       UPDATE travel_post_comment tpc
       SET status = 'deleted',
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       FROM current_comment cc
       WHERE tpc.comment_id = cc.comment_id
       RETURNING
         tpc.comment_id,
         tpc.post_id,
         tpc.user_id,
         tpc.parent_comment_id,
         tpc.content,
         cc.from_status,
         tpc.status,
         tpc.created_at,
         tpc.updated_at,
         tpc.deleted_at`,
      [commentId]
    );

    return result.rows[0] || null;
  }

  async listReportsForAdmin(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildAdminReportWhere(query);
    const sort = REPORT_SORT_COLUMNS[query.sort] || REPORT_SORT_COLUMNS.newest;

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_post_report tpr
       JOIN users reporter ON reporter.user_id = tpr.user_id
       JOIN travel_post tp ON tp.post_id = tpr.post_id
       JOIN users post_author ON post_author.user_id = tp.user_id
       LEFT JOIN users reviewer ON reviewer.user_id = tpr.reviewed_by
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
    const limitParam = values.length - 1;
    const offsetParam = values.length;

    const result = await db.query(
      `SELECT
          tpr.report_id,
          tpr.post_id,
          tpr.user_id,
          tpr.reason,
          tpr.description,
          tpr.status,
          tpr.reviewed_by,
          tpr.reviewed_at,
          tpr.created_at,
          json_build_object(
            'user_id', reporter.user_id,
            'name', reporter.name,
            'email', reporter.email,
            'avatar_url', reporter.avatar_url,
            'status', reporter.status
          ) AS reporter,
          CASE
            WHEN reviewer.user_id IS NULL THEN NULL
            ELSE json_build_object(
              'user_id', reviewer.user_id,
              'name', reviewer.name,
              'email', reviewer.email,
              'avatar_url', reviewer.avatar_url,
              'status', reviewer.status
            )
          END AS reviewer,
          json_build_object(
            'post_id', tp.post_id,
            'content', tp.content,
            'status', tp.status,
            'visibility', tp.visibility,
            'like_count', tp.like_count,
            'comment_count', tp.comment_count,
            'report_count', tp.report_count,
            'share_count', tp.share_count,
            'created_at', tp.created_at,
            'updated_at', tp.updated_at,
            'deleted_at', tp.deleted_at,
            'author', json_build_object(
              'user_id', post_author.user_id,
              'name', post_author.name,
              'email', post_author.email,
              'avatar_url', post_author.avatar_url,
              'status', post_author.status
            ),
            'cover_image_url', (
              SELECT tpp.image_url
              FROM travel_post_photo tpp
              WHERE tpp.post_id = tp.post_id
                AND tpp.deleted_at IS NULL
              ORDER BY tpp.display_order ASC, tpp.photo_id ASC
              LIMIT 1
            )
          ) AS post
       FROM travel_post_report tpr
       JOIN users reporter ON reporter.user_id = tpr.user_id
       JOIN travel_post tp ON tp.post_id = tpr.post_id
       JOIN users post_author ON post_author.user_id = tp.user_id
       LEFT JOIN users reviewer ON reviewer.user_id = tpr.reviewed_by
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

  async findReportForUpdate(reportId, executor = db) {
    const result = await executor.query(
      `SELECT report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at
       FROM travel_post_report
       WHERE report_id = $1
       FOR UPDATE`,
      [reportId]
    );

    return result.rows[0] || null;
  }

  async reviewReportForAdmin(reportId, payload, reviewedBy, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_report
       SET status = $2,
           reviewed_by = $3,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE report_id = $1
       RETURNING report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at`,
      [reportId, payload.status, reviewedBy]
    );

    return result.rows[0] || null;
  }

  async resolveReportsForPost(postId, reviewedBy, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_report
       SET status = 'resolved',
           reviewed_by = $2,
           reviewed_at = CURRENT_TIMESTAMP
       WHERE post_id = $1
         AND status = 'pending'
       RETURNING report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at`,
      [postId, reviewedBy]
    );

    return result.rows;
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
      `SELECT
         tpc.comment_id,
         tpc.post_id,
         tpc.user_id,
         tpc.parent_comment_id,
         tpc.content,
         tpc.status,
         tpc.created_at,
         tpc.updated_at
       FROM travel_post_comment tpc
       JOIN travel_post tp ON tp.post_id = tpc.post_id
       WHERE tpc.comment_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL
         AND tp.status = 'published'
         AND tp.visibility = 'public'
         AND tp.deleted_at IS NULL`,
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
      `UPDATE travel_post_comment tpc
       SET content = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE tpc.comment_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL
         AND EXISTS (
           SELECT 1
           FROM travel_post tp
           WHERE tp.post_id = tpc.post_id
             AND tp.status = 'published'
             AND tp.visibility = 'public'
             AND tp.deleted_at IS NULL
         )
       RETURNING tpc.comment_id, tpc.post_id, tpc.user_id, tpc.parent_comment_id, tpc.content, tpc.status, tpc.created_at, tpc.updated_at`,
      [commentId, content]
    );

    return result.rows[0] || null;
  }

  async softDeleteComment(commentId, executor = db) {
    const result = await executor.query(
      `UPDATE travel_post_comment tpc
       SET status = 'deleted',
           deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE tpc.comment_id = $1
         AND tpc.status = 'published'
         AND tpc.deleted_at IS NULL
         AND EXISTS (
           SELECT 1
           FROM travel_post tp
           WHERE tp.post_id = tpc.post_id
             AND tp.status = 'published'
             AND tp.visibility = 'public'
             AND tp.deleted_at IS NULL
         )
       RETURNING tpc.comment_id, tpc.post_id, tpc.user_id, tpc.parent_comment_id, tpc.content, tpc.status, tpc.created_at, tpc.updated_at`,
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
