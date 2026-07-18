const db = require('../config/db');

class BlogCategoryLinkModel {
  async replaceForBlog(blogId, categoryIds, executor = db) {
    await executor.query('DELETE FROM blog_blog_category WHERE blog_id = $1', [blogId]);

    if (!categoryIds.length) return;

    const values = [blogId, ...categoryIds];
    const rows = categoryIds.map((_, index) => `($1, $${index + 2})`).join(', ');
    await executor.query(
      `INSERT INTO blog_blog_category (blog_id, blog_category_id) VALUES ${rows}`,
      values
    );
  }
}

module.exports = new BlogCategoryLinkModel();
