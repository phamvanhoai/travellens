const db = require('../config/db');

module.exports = {
  /**
   * Save a chat message (user or assistant) to history.
   */
  async create({ userId, role, content, metadata = null }) {
    const result = await db.query(
      `INSERT INTO ai_chat_history (user_id, role, content, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, role, content, metadata ? JSON.stringify(metadata) : null]
    );
    return result.rows[0];
  },

  /**
   * Get recent chat history for a user (latest N messages, ordered ascending).
   */
  async findByUserId(userId, limit = 50) {
    const result = await db.query(
      `SELECT chat_id, role, content, metadata, created_at
       FROM ai_chat_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    // Return in chronological order (oldest first)
    return result.rows.reverse();
  },

  /**
   * Delete all chat history for a user.
   */
  async deleteByUserId(userId) {
    const result = await db.query(
      `DELETE FROM ai_chat_history WHERE user_id = $1`,
      [userId]
    );
    return result.rowCount;
  },
};
