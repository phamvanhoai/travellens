const db = require('../config/db');

const storySelect = `
  s.story_id, s.user_id, s.media_url, s.media_type, s.caption, s.status,
  s.expires_at, s.created_at, s.updated_at,
  json_build_object('user_id', u.user_id, 'name', u.name, 'avatar_url', u.avatar_url) AS author,
  (SELECT COUNT(*)::int FROM travel_story_view sv WHERE sv.story_id = s.story_id) AS viewer_count
`;

class TravelStoryModel {
  async create(userId, payload, client = db) {
    const result = await client.query(
      `INSERT INTO travel_story (user_id, media_url, media_type, caption)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, payload.media_url, payload.media_type, payload.caption || null]
    );
    return result.rows[0];
  }

  async listActive(viewerId, role = 'customer', query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 30), 1), 100);
    const offset = (page - 1) * limit;
    const isCustomer = role === 'customer';
    const blockClause = isCustomer
      ? `AND NOT EXISTS (
           SELECT 1 FROM user_block ub
           WHERE (ub.blocker_id = $1 AND ub.blocked_id = s.user_id)
              OR (ub.blocker_id = s.user_id AND ub.blocked_id = $1)
         )`
      : '';
    const viewedExpression = isCustomer
      ? `EXISTS(SELECT 1 FROM travel_story_view own_view
                 WHERE own_view.story_id = s.story_id AND own_view.viewer_id = $1)`
      : 'FALSE';
    const countValues = isCustomer ? [viewerId] : [];
    const paginationPlaceholders = isCustomer
      ? { limit: '$2', offset: '$3', values: [viewerId, limit, offset] }
      : { limit: '$1', offset: '$2', values: [limit, offset] };
    const count = await db.query(
      `SELECT COUNT(*)::int AS total FROM travel_story s
       WHERE s.status = 'active' AND s.deleted_at IS NULL AND s.expires_at > CURRENT_TIMESTAMP
       ${blockClause}`,
      countValues
    );
    const result = await db.query(
      `SELECT ${storySelect},
              ${viewedExpression} AS is_viewed
       FROM travel_story s
       INNER JOIN users u ON u.user_id = s.user_id AND u.status = 'active'
       WHERE s.status = 'active' AND s.deleted_at IS NULL AND s.expires_at > CURRENT_TIMESTAMP
       ${blockClause}
       ORDER BY s.created_at DESC
       LIMIT ${paginationPlaceholders.limit} OFFSET ${paginationPlaceholders.offset}`,
      paginationPlaceholders.values
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async listOwned(userId, query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 30), 1), 100);
    const offset = (page - 1) * limit;
    const activeClause = query.status === 'expired'
      ? 'AND s.expires_at <= CURRENT_TIMESTAMP'
      : query.status === 'all' ? '' : 'AND s.expires_at > CURRENT_TIMESTAMP';
    const values = [userId];
    const count = await db.query(
      `SELECT COUNT(*)::int AS total FROM travel_story s
       WHERE s.user_id = $1 AND s.status = 'active' AND s.deleted_at IS NULL ${activeClause}`,
      values
    );
    const result = await db.query(
      `SELECT ${storySelect}, TRUE AS is_owned
       FROM travel_story s INNER JOIN users u ON u.user_id = s.user_id
       WHERE s.user_id = $1 AND s.status = 'active' AND s.deleted_at IS NULL ${activeClause}
       ORDER BY s.created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findActiveById(id, viewerId, role = 'customer') {
    const isCustomer = role === 'customer';
    const viewedExpression = isCustomer
      ? `EXISTS(SELECT 1 FROM travel_story_view own_view
                 WHERE own_view.story_id = s.story_id AND own_view.viewer_id = $2)`
      : 'FALSE';
    const blockClause = isCustomer
      ? `AND NOT EXISTS (
           SELECT 1 FROM user_block ub
           WHERE (ub.blocker_id = $2 AND ub.blocked_id = s.user_id)
              OR (ub.blocker_id = s.user_id AND ub.blocked_id = $2)
         )`
      : '';
    const result = await db.query(
      `SELECT ${storySelect},
              ${viewedExpression} AS is_viewed
       FROM travel_story s INNER JOIN users u ON u.user_id = s.user_id
       WHERE s.story_id = $1 AND s.status = 'active' AND s.deleted_at IS NULL
         AND s.expires_at > CURRENT_TIMESTAMP
         ${blockClause}`,
      isCustomer ? [id, viewerId] : [id]
    );
    return result.rows[0] || null;
  }

  async addView(storyId, viewerId) {
    const result = await db.query(
      `INSERT INTO travel_story_view (story_id, viewer_id) VALUES ($1, $2)
       ON CONFLICT (story_id, viewer_id) DO NOTHING RETURNING viewed_at`,
      [storyId, viewerId]
    );
    return result.rows[0] || null;
  }

  async listViewersOwned(storyId, ownerId, query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 30), 1), 100);
    const offset = (page - 1) * limit;
    const owner = await db.query(
      `SELECT story_id FROM travel_story
       WHERE story_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [storyId, ownerId]
    );
    if (!owner.rowCount) return null;
    const count = await db.query('SELECT COUNT(*)::int AS total FROM travel_story_view WHERE story_id = $1', [storyId]);
    const result = await db.query(
      `SELECT u.user_id, u.name, u.avatar_url, sv.viewed_at
       FROM travel_story_view sv INNER JOIN users u ON u.user_id = sv.viewer_id
       WHERE sv.story_id = $1 ORDER BY sv.viewed_at DESC LIMIT $2 OFFSET $3`,
      [storyId, limit, offset]
    );
    const total = count.rows[0].total;
    return { items: result.rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async softDeleteOwned(id, userId) {
    const result = await db.query(
      `UPDATE travel_story SET status = 'deleted', deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE story_id = $1 AND user_id = $2 AND status = 'active' AND deleted_at IS NULL
       RETURNING story_id, media_url`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}

module.exports = new TravelStoryModel();
