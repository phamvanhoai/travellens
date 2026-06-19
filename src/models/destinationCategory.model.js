const BaseModel = require('./base.model');
const db = require('../config/db');

class DestinationCategoryModel extends BaseModel {
  constructor() {
    super({
      table: 'destination_category',
      primaryKey: 'destination_category_id',
      fields: ['name', 'description', 'created_at', 'updated_at'],
      searchable: ['name', 'description'],
    });
  }

  async countActiveDestinations(id) {
    const result = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_destination
       WHERE destination_category_id = $1
         AND deleted_at IS NULL`,
      [id]
    );

    return result.rows[0].total;
  }
}

module.exports = new DestinationCategoryModel();

