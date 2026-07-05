const db = require('../config/db');

const SORT_COLUMNS = {
  newest: 'tp.created_at DESC, tp.post_id DESC',
  oldest: 'tp.created_at ASC, tp.post_id ASC',
  popular: 'tp.like_count DESC, tp.comment_count DESC, tp.created_at DESC, tp.post_id DESC',
};

const buildFeedWhere = (query = {}) => {
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
    const where = buildFeedWhere(query);
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
}

module.exports = new TravelPostModel();
