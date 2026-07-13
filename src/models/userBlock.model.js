const db = require('../config/db');

class UserBlockModel {
  async findActiveCustomerById(userId, executor = db) {
    const result = await executor.query(
      `SELECT user_id, name, avatar_url, role, status
       FROM users
       WHERE user_id = $1
         AND role = 'customer'
         AND status = 'active'`,
      [userId]
    );

    return result.rows[0] || null;
  }

  async block(blockerId, blockedId, executor = db) {
    const result = await executor.query(
      `INSERT INTO user_block (blocker_id, blocked_id)
       VALUES ($1, $2)
       ON CONFLICT (blocker_id, blocked_id) DO NOTHING
       RETURNING blocker_id, blocked_id, created_at`,
      [blockerId, blockedId]
    );

    return result.rows[0] || null;
  }

  async unblock(blockerId, blockedId, executor = db) {
    const result = await executor.query(
      `DELETE FROM user_block
       WHERE blocker_id = $1
         AND blocked_id = $2
       RETURNING blocker_id, blocked_id, created_at`,
      [blockerId, blockedId]
    );

    return result.rows[0] || null;
  }

  async getBlockStatus(userId, targetUserId, executor = db) {
    const result = await executor.query(
      `SELECT
          EXISTS (
            SELECT 1
            FROM user_block
            WHERE blocker_id = $1
              AND blocked_id = $2
          ) AS is_blocked_by_me,
          EXISTS (
            SELECT 1
            FROM user_block
            WHERE blocker_id = $2
              AND blocked_id = $1
          ) AS has_blocked_me`,
      [userId, targetUserId]
    );

    return result.rows[0] || {
      is_blocked_by_me: false,
      has_blocked_me: false,
    };
  }

  async hasEitherBlock(userId, targetUserId, executor = db) {
    const status = await this.getBlockStatus(userId, targetUserId, executor);
    return Boolean(status.is_blocked_by_me || status.has_blocked_me);
  }

  async listBlockedUsers(userId, query = {}, executor = db) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;

    const countResult = await executor.query(
      `SELECT COUNT(*)::int AS total
       FROM user_block ub
       JOIN users u ON u.user_id = ub.blocked_id
       WHERE ub.blocker_id = $1`,
      [userId]
    );

    const result = await executor.query(
      `SELECT
          u.user_id,
          u.name,
          u.avatar_url,
          u.role,
          u.status,
          ub.created_at AS blocked_at
       FROM user_block ub
       JOIN users u ON u.user_id = ub.blocked_id
       WHERE ub.blocker_id = $1
       ORDER BY ub.created_at DESC, u.user_id DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      items: result.rows,
      total: countResult.rows[0].total,
      page,
      limit,
    };
  }
}

module.exports = new UserBlockModel();
