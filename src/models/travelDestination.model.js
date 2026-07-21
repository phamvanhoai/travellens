const db = require('../config/db');

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['td.deleted_at IS NULL'];

  if (query.search) {
    values.push(`%${query.search}%`);
    const vietnameseChars = 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ';
    const asciiChars = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
    const normalizedQuery = `translate(lower($${values.length}), '${vietnameseChars}', '${asciiChars}')`;
    clauses.push(`(
      translate(lower(td.name), '${vietnameseChars}', '${asciiChars}') LIKE ${normalizedQuery}
      OR translate(lower(COALESCE(td.description, '')), '${vietnameseChars}', '${asciiChars}') LIKE ${normalizedQuery}
    )`);
  }

  if (query.destination_category_id) {
    values.push(query.destination_category_id);
    clauses.push(`td.destination_category_id = $${values.length}`);
  }

  return {
    text: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
};

const listSortColumns = {
  created_at: 'td.created_at',
  updated_at: 'td.updated_at',
  name: 'td.name',
};

module.exports = {
  async findAllWithPagination(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 8), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const sortBy = listSortColumns[query.sortBy] || listSortColumns.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM travel_destination td
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
    const result = await db.query(
      `SELECT
          td.destination_id,
          td.name,
          td.description,
          td.thumbnail,
          td.latitude,
          td.longitude,
          td.destination_category_id,
          dc.name AS destination_category,
          td.created_at,
          td.updated_at
       FROM travel_destination td
       LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
       ${where.text}
       ORDER BY ${sortBy} ${sortOrder}, td.destination_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    const total = countResult.rows[0].total;
    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findDetailById(id) {
    const result = await db.query(
      `SELECT
          td.destination_id,
          td.name,
          td.description,
          td.thumbnail,
          td.latitude,
          td.longitude,
          td.destination_category_id,
          dc.name AS destination_category,
          td.created_at,
          td.updated_at
       FROM travel_destination td
       LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
       WHERE td.destination_id = $1 AND td.deleted_at IS NULL`,
      [id]
    );

    return result.rows[0] || null;
  },

  async findActiveById(id) {
    const result = await db.query(
      'SELECT * FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [id]
    );

    return result.rows[0] || null;
  },

  async findDuplicateName(name, exceptDestinationId) {
    const values = [name];
    let exceptClause = '';
    if (exceptDestinationId) {
      values.push(exceptDestinationId);
      exceptClause = `AND destination_id <> $${values.length}`;
    }

    const result = await db.query(
      `SELECT destination_id
       FROM travel_destination
       WHERE LOWER(name) = LOWER($1)
         AND deleted_at IS NULL
         ${exceptClause}`,
      values
    );

    return result.rows[0] || null;
  },

  async destinationCategoryExists(destinationCategoryId) {
    if (destinationCategoryId === undefined || destinationCategoryId === null || destinationCategoryId === '') {
      return true;
    }

    const result = await db.query(
      'SELECT destination_category_id FROM destination_category WHERE destination_category_id = $1',
      [destinationCategoryId]
    );

    return Boolean(result.rows[0]);
  },

  async createDestination(payload) {
    const result = await db.query(
      `INSERT INTO travel_destination (name, description, thumbnail, latitude, longitude, destination_category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        payload.name,
        payload.description,
        payload.thumbnail,
        payload.latitude,
        payload.longitude,
        payload.destination_category_id,
      ]
    );

    return result.rows[0];
  },

  async updateDestination(id, payload) {
    const fields = ['name', 'description', 'thumbnail', 'latitude', 'longitude', 'destination_category_id']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(id);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await db.query(
      `UPDATE travel_destination
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE destination_id = $${values.length} AND deleted_at IS NULL
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async countRelations(id) {
    const result = await db.query(
      `SELECT
          (
            SELECT COUNT(DISTINCT t.tour_id)::int
            FROM tour t
            INNER JOIN tour_destination td ON td.tour_id = t.tour_id
            WHERE td.destination_id = $1
              AND t.deleted_at IS NULL
          ) AS total_tours,
          (SELECT COUNT(*)::int FROM location WHERE destination_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE) AS total_locations`,
      [id]
    );

    return result.rows[0];
  },

  async softDeleteDestination(id) {
    const result = await db.query(
      `UPDATE travel_destination
       SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE destination_id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  },

  async getLocations(id) {
    const result = await db.query(
      `SELECT *
       FROM location
       WHERE destination_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE
       ORDER BY location_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getMaps(id) {
    const result = await db.query(
      `SELECT
          m.map_id,
          m.location_id,
          l.name AS location_name,
          m.title,
          m.map_file,
          m.description,
          m.display_order,
          m.created_at,
          m.updated_at
       FROM map m
       INNER JOIN location l ON l.location_id = m.location_id
       WHERE l.destination_id = $1
         AND l.deleted_at IS NULL
         AND l.is_deleted = FALSE
         AND m.deleted_at IS NULL
         AND m.is_deleted = FALSE
       ORDER BY m.display_order ASC NULLS LAST, m.map_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getBlogs(id) {
    const result = await db.query(
      `SELECT DISTINCT
          b.blog_id,
          b.user_id,
          u.name AS author_name,
          b.title,
          b.content,
          b.date_created
       FROM blog b
       INNER JOIN blog_location bl ON bl.blog_id = b.blog_id
       INNER JOIN location l ON l.location_id = bl.location_id
       LEFT JOIN users u ON u.user_id = b.user_id
       WHERE l.destination_id = $1
         AND l.deleted_at IS NULL
         AND l.is_deleted = FALSE
       ORDER BY b.date_created DESC, b.blog_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getReviews(id) {
    const result = await db.query(
      `SELECT
          r.review_id,
          r.user_id,
          u.name AS user_name,
          u.avatar_url AS user_avatar_url,
          r.location_id,
          l.name AS location_name,
          r.rating,
          r.comment,
          r.images,
          r.date_created,
          r.created_at,
          r.updated_at
       FROM review r
       INNER JOIN location l ON l.location_id = r.location_id
       LEFT JOIN users u ON u.user_id = r.user_id
       WHERE l.destination_id = $1
         AND l.deleted_at IS NULL
         AND l.is_deleted = FALSE
         AND r.deleted_at IS NULL
         AND r.status = 'approved'
       ORDER BY r.review_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getTours(id) {
    const result = await db.query(
      `SELECT
          t.*,
          td.order_index,
          td.estimated_time,
          td.note
       FROM tour t
       INNER JOIN tour_destination td ON td.tour_id = t.tour_id
       WHERE td.destination_id = $1
         AND t.deleted_at IS NULL
         AND t.status = 'active'
       ORDER BY td.order_index ASC, t.tour_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getView360(id) {
    const result = await db.query(
      `SELECT v.*
       FROM view360 v
       INNER JOIN location l ON l.location_id = v.location_id
       WHERE l.destination_id = $1
         AND l.deleted_at IS NULL
         AND l.is_deleted = FALSE
         AND v.deleted_at IS NULL
       ORDER BY v.view_id DESC`,
      [id]
    );

    return result.rows;
  },

  async getStatistics(id) {
    const result = await db.query(
      `SELECT
          (
            SELECT COUNT(*)::int
            FROM location
            WHERE destination_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE
          ) AS total_locations,
          (
            SELECT COUNT(DISTINCT t.tour_id)::int
            FROM tour t
            INNER JOIN tour_destination td ON td.tour_id = t.tour_id
            WHERE td.destination_id = $1
              AND t.deleted_at IS NULL
          ) AS total_tours,
          (
            SELECT COUNT(*)::int
            FROM booking b
            INNER JOIN tour t ON t.tour_id = b.tour_id
            INNER JOIN tour_destination td ON td.tour_id = t.tour_id
            WHERE td.destination_id = $1
              AND t.deleted_at IS NULL
          ) AS total_bookings,
          (
            SELECT COUNT(*)::int
            FROM review r
            INNER JOIN location l ON l.location_id = r.location_id
            WHERE l.destination_id = $1
              AND l.deleted_at IS NULL
              AND l.is_deleted = FALSE
              AND r.deleted_at IS NULL
              AND r.status = 'approved'
          ) AS total_reviews`,
      [id]
    );

    return result.rows[0];
  },

  async findExistingActiveIds(ids, executor = db) {
    if (!ids.length) return [];
    const result = await executor.query(
      `SELECT destination_id
       FROM travel_destination
       WHERE destination_id = ANY($1::int[])
         AND deleted_at IS NULL`,
      [ids]
    );
    return result.rows.map((row) => Number(row.destination_id));
  },
};

