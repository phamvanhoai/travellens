const db = require('../config/db');

class MediaFileModel {
  async create(payload) {
    const result = await db.query(
      `INSERT INTO media_file
        (uploaded_by, original_name, file_name, file_url, mime_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        payload.uploaded_by,
        payload.original_name,
        payload.file_name,
        payload.file_url,
        payload.mime_type,
        payload.file_size,
      ]
    );
    return result.rows[0];
  }

  async list({ page = 1, limit = 20, search, mime_type: mimeType } = {}) {
    const clauses = ['deleted_at IS NULL'];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      clauses.push(`(original_name ILIKE $${values.length} OR file_name ILIKE $${values.length})`);
    }
    if (mimeType) {
      values.push(mimeType);
      clauses.push(`mime_type = $${values.length}`);
    }

    const where = `WHERE ${clauses.join(' AND ')}`;
    const countResult = await db.query(`SELECT COUNT(*)::int AS total FROM media_file ${where}`, values);
    const offset = (Number(page) - 1) * Number(limit);
    const listValues = [...values, Number(limit), offset];
    const result = await db.query(
      `SELECT media_id, uploaded_by, original_name, file_name, file_url,
              mime_type, file_size, created_at, updated_at
       FROM media_file
       ${where}
       ORDER BY created_at DESC, media_id DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues
    );

    const total = countResult.rows[0].total;
    return {
      items: result.rows,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findById(id) {
    const result = await db.query(
      `SELECT media_id, uploaded_by, original_name, file_name, file_url,
              mime_type, file_size, created_at, updated_at
       FROM media_file
       WHERE media_id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findBlogUsage(fileUrl) {
    const result = await db.query(
      `SELECT blog_id, title
       FROM blog
       WHERE content LIKE $1
       ORDER BY blog_id DESC`,
      [`%${fileUrl}%`]
    );
    return result.rows;
  }

  async findActiveUrls(fileUrls) {
    if (!fileUrls.length) return [];
    const result = await db.query(
      `SELECT file_url
       FROM media_file
       WHERE file_url = ANY($1::text[]) AND deleted_at IS NULL`,
      [fileUrls]
    );
    return result.rows.map((row) => row.file_url);
  }

  async updateOriginalName(id, originalName) {
    const result = await db.query(
      `UPDATE media_file
       SET original_name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE media_id = $2 AND deleted_at IS NULL
       RETURNING media_id, uploaded_by, original_name, file_name, file_url,
                 mime_type, file_size, created_at, updated_at`,
      [originalName, id]
    );
    return result.rows[0] || null;
  }

  async softDelete(id) {
    const result = await db.query(
      `UPDATE media_file
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE media_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }
}

module.exports = new MediaFileModel();
