const db = require('../config/db');

module.exports = {
  async findSavedIdsByUser(userId) {
    const result = await db.query(
      `SELECT tour_id FROM saved_tour WHERE user_id = $1`,
      [userId]
    );
    return result.rows.map(row => row.tour_id);
  },

  async isSaved(userId, tourId) {
    const result = await db.query(
      `SELECT 1 FROM saved_tour WHERE user_id = $1 AND tour_id = $2`,
      [userId, tourId]
    );
    return result.rows.length > 0;
  },

  async save(userId, tourId) {
    await db.query(
      `INSERT INTO saved_tour (user_id, tour_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, tourId]
    );
  },

  async unsave(userId, tourId) {
    await db.query(
      `DELETE FROM saved_tour WHERE user_id = $1 AND tour_id = $2`,
      [userId, tourId]
    );
  },

  async getSavedToursList(userId, limit, offset) {
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM saved_tour st
       JOIN tour t ON st.tour_id = t.tour_id
       WHERE st.user_id = $1 AND t.deleted_at IS NULL`,
      [userId]
    );
    const total = countResult.rows[0].total;

    const result = await db.query(
      `SELECT t.*, st.created_at AS saved_at
       FROM saved_tour st
       JOIN tour t ON st.tour_id = t.tour_id
       WHERE st.user_id = $1 AND t.deleted_at IS NULL
       ORDER BY st.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      items: result.rows,
      total,
    };
  },
};
