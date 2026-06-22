const BaseModel = require('./base.model');
const db = require('../config/db');

class TourCategoryModel extends BaseModel {
  constructor() {
    super({
      table: 'tour_category',
      primaryKey: 'tour_category_id',
      fields: ['name', 'description', 'created_at', 'updated_at'],
      searchable: ['name', 'description'],
    });
  }

  async countActiveTours(id) {
    const result = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM tour
       WHERE tour_category_id = $1
         AND deleted_at IS NULL`,
      [id]
    );

    return result.rows[0].total;
  }

  async exists(id, executor = db) {
    const result = await executor.query(
      'SELECT tour_category_id FROM tour_category WHERE tour_category_id = $1',
      [id]
    );
    return Boolean(result.rows[0]);
  }
}

module.exports = new TourCategoryModel();

