const db = require('../config/db');

const hotspotColumns = `
  hotspot_id,
  view360_id,
  type,
  title,
  description,
  yaw::float AS yaw,
  pitch::float AS pitch,
  target_view360_id,
  target_url,
  order_index,
  is_active,
  created_at,
  updated_at
`;

module.exports = {
  async findByView(view360Id, { activeOnly = false } = {}, executor = db) {
    const values = [view360Id];
    const activeClause = activeOnly ? 'AND is_active = TRUE' : '';
    const result = await executor.query(
      `SELECT ${hotspotColumns}
       FROM view360_hotspot
       WHERE view360_id = $1
         AND deleted_at IS NULL
         ${activeClause}
       ORDER BY order_index ASC NULLS LAST, hotspot_id ASC`,
      values
    );
    return result.rows;
  },

  async findActiveById(hotspotId, executor = db) {
    const result = await executor.query(
      `SELECT ${hotspotColumns}
       FROM view360_hotspot
       WHERE hotspot_id = $1
         AND deleted_at IS NULL`,
      [hotspotId]
    );
    return result.rows[0] || null;
  },

  async createForView(view360Id, payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO view360_hotspot
         (view360_id, type, title, description, yaw, pitch, target_view360_id,
          target_url, order_index, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING ${hotspotColumns}`,
      [
        view360Id,
        payload.type || 'info',
        payload.title,
        payload.description,
        payload.yaw,
        payload.pitch,
        payload.target_view360_id,
        payload.target_url,
        payload.order_index ?? 0,
        payload.is_active ?? true,
      ]
    );
    return result.rows[0];
  },

  async updateActive(hotspotId, payload, executor = db) {
    const fields = [
      'type',
      'title',
      'description',
      'yaw',
      'pitch',
      'target_view360_id',
      'target_url',
      'order_index',
      'is_active',
    ].filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(hotspotId, executor);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(hotspotId);

    const result = await executor.query(
      `UPDATE view360_hotspot
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE hotspot_id = $${values.length}
         AND deleted_at IS NULL
       RETURNING ${hotspotColumns}`,
      values
    );
    return result.rows[0] || null;
  },

  async softDelete(hotspotId, executor = db) {
    const result = await executor.query(
      `UPDATE view360_hotspot
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE hotspot_id = $1
         AND deleted_at IS NULL
       RETURNING ${hotspotColumns}`,
      [hotspotId]
    );
    return result.rows[0] || null;
  },
};
