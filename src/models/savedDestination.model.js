const db = require('../config/db');

module.exports = {
  async findSavedIdsByUser(userId) {
    const result = await db.query(
      `SELECT destination_id FROM saved_destination WHERE user_id = $1`,
      [userId]
    );
    return result.rows.map(row => row.destination_id);
  },

  async isSaved(userId, destinationId) {
    const result = await db.query(
      `SELECT 1 FROM saved_destination WHERE user_id = $1 AND destination_id = $2`,
      [userId, destinationId]
    );
    return result.rows.length > 0;
  },

  async save(userId, destinationId) {
    await db.query(
      `INSERT INTO saved_destination (user_id, destination_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, destinationId]
    );
  },

  async unsave(userId, destinationId) {
    await db.query(
      `DELETE FROM saved_destination WHERE user_id = $1 AND destination_id = $2`,
      [userId, destinationId]
    );
  },

  async getSavedDestinationsList(userId, limit, offset) {
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM saved_destination sd
       JOIN travel_destination td ON sd.destination_id = td.destination_id
       WHERE sd.user_id = $1 AND td.deleted_at IS NULL`,
      [userId]
    );
    const total = countResult.rows[0].total;

    const result = await db.query(
      `SELECT td.*, sd.created_at AS saved_at
       FROM saved_destination sd
       JOIN travel_destination td ON sd.destination_id = td.destination_id
       WHERE sd.user_id = $1 AND td.deleted_at IS NULL
       ORDER BY sd.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      items: result.rows,
      total,
    };
  },
};
