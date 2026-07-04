const BaseModel = require('./base.model');
const db = require('../config/db');

class BlogCategoryModel extends BaseModel {
  constructor() {
    super({
      table: 'blog_category',
      primaryKey: 'blog_category_id',
      fields: ['name', 'description'],
      searchable: ['name', 'description'],
    });
  }

  async exists(id, executor = db) {
    const result = await executor.query(
      'SELECT 1 FROM blog_category WHERE blog_category_id = $1',
      [id]
    );
    return result.rowCount > 0;
  }

  async countBlogs(id) {
    const result = await db.query(
      'SELECT COUNT(*)::int AS total FROM blog WHERE blog_category_id = $1',
      [id]
    );
    return result.rows[0].total;
  }
}

module.exports = new BlogCategoryModel();
