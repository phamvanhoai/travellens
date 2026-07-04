const db = require('../config/db');

class BlogCommentModel {
  async findApprovedByBlog(blogId, query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM blog_comment
       WHERE blog_id = $1
         AND parent_comment_id IS NULL
         AND status = 'approved'
         AND deleted_at IS NULL`,
      [blogId]
    );

    const result = await db.query(
      `SELECT
          bc.comment_id,
          bc.blog_id,
          bc.user_id,
          bc.parent_comment_id,
          bc.content,
          bc.content AS comment,
          bc.status,
          bc.created_at,
          bc.updated_at,
          u.name AS user_name,
          u.avatar_url AS user_avatar_url
       FROM blog_comment bc
       LEFT JOIN users u ON u.user_id = bc.user_id
       WHERE bc.blog_id = $1
         AND bc.parent_comment_id IS NULL
         AND bc.status = 'approved'
         AND bc.deleted_at IS NULL
       ORDER BY bc.comment_id DESC
       LIMIT $2 OFFSET $3`,
      [blogId, limit, offset]
    );

    const rows = result.rows;
    const parentIds = rows.map((row) => row.comment_id);
    let replies = [];

    if (parentIds.length) {
      const repliesResult = await db.query(
        `SELECT
            bc.comment_id,
            bc.blog_id,
            bc.user_id,
            bc.parent_comment_id,
            bc.content,
            bc.content AS comment,
            bc.status,
            bc.created_at,
            bc.updated_at,
            u.name AS user_name,
            u.avatar_url AS user_avatar_url
         FROM blog_comment bc
         LEFT JOIN users u ON u.user_id = bc.user_id
         WHERE bc.blog_id = $1
           AND bc.parent_comment_id = ANY($2::int[])
           AND bc.status = 'approved'
           AND bc.deleted_at IS NULL
         ORDER BY bc.comment_id ASC`,
        [blogId, parentIds]
      );
      replies = repliesResult.rows;
    }

    const repliesByParent = replies.reduce((grouped, reply) => {
      const key = Number(reply.parent_comment_id);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(reply);
      return grouped;
    }, new Map());

    const total = countResult.rows[0].total;
    return {
      data: rows.map((row) => ({
        ...row,
        replies: repliesByParent.get(Number(row.comment_id)) || [],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create({ blogId, userId, parentCommentId = null, content, status = 'approved' }) {
    const result = await db.query(
      `INSERT INTO blog_comment (blog_id, user_id, parent_comment_id, content, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING comment_id, blog_id, user_id, parent_comment_id, content, content AS comment, status, created_at, updated_at`,
      [blogId, userId, parentCommentId, content, status]
    );

    return result.rows[0];
  }

  async findActiveByIdAndBlog(commentId, blogId) {
    const result = await db.query(
      `SELECT comment_id, blog_id, user_id, parent_comment_id, content, status
       FROM blog_comment
       WHERE comment_id = $1
         AND blog_id = $2
         AND deleted_at IS NULL
       LIMIT 1`,
      [commentId, blogId]
    );

    return result.rows[0] || null;
  }

  async findActiveParentByIdAndBlog(commentId, blogId) {
    const result = await db.query(
      `SELECT comment_id, blog_id, user_id
       FROM blog_comment
       WHERE comment_id = $1
         AND blog_id = $2
         AND parent_comment_id IS NULL
         AND deleted_at IS NULL
       LIMIT 1`,
      [commentId, blogId]
    );

    return result.rows[0] || null;
  }

  async update(commentId, blogId, { content }) {
    const result = await db.query(
      `UPDATE blog_comment
       SET content = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE comment_id = $1
         AND blog_id = $2
         AND deleted_at IS NULL
       RETURNING comment_id, blog_id, user_id, parent_comment_id, content, content AS comment, status, created_at, updated_at`,
      [commentId, blogId, content]
    );

    return result.rows[0] || null;
  }

  async softDelete(commentId, blogId) {
    const result = await db.query(
      `UPDATE blog_comment
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE comment_id = $1
         AND blog_id = $2
         AND deleted_at IS NULL
       RETURNING comment_id, blog_id, user_id, parent_comment_id, content, content AS comment, status, created_at, updated_at`,
      [commentId, blogId]
    );

    return result.rows[0] || null;
  }
}

module.exports = new BlogCommentModel();
