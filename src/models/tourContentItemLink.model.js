const db = require('../config/db');

class TourContentItemLinkModel {
  async replaceForTour(tourId, items, client = db) {
    await client.query('DELETE FROM tour_content_item_link WHERE tour_id = $1', [tourId]);
    if (!items.length) return [];
    const values = [];
    const rows = items.map((item, index) => {
      const base = index * 6;
      values.push(tourId, item.content_item_id, item.content_item_id, item.type, item.content, item.sort_order);
      return `(${Array.from({ length: 6 }, (_, offset) => `$${base + offset + 1}`).join(', ')})`;
    });
    const result = await client.query(
      `INSERT INTO tour_content_item_link (
        tour_id, content_item_id, source_content_item_id, content_type, snapshot_content, sort_order
      ) VALUES ${rows.join(', ')} RETURNING *`,
      values
    );
    return result.rows;
  }

  async findByTourId(tourId, client = db) {
    const result = await client.query(
      `SELECT content_item_id AS id, source_content_item_id, content_type AS type,
              snapshot_content AS content, sort_order
       FROM tour_content_item_link WHERE tour_id = $1 ORDER BY sort_order ASC`,
      [tourId]
    );
    return result.rows;
  }
}

module.exports = new TourContentItemLinkModel();

