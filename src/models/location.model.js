const db = require('../config/db');

const SORT_COLUMNS = {
  location_id: 'l.location_id',
  name: 'l.name',
  created_at: 'l.created_at',
  updated_at: 'l.updated_at',
};

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['l.deleted_at IS NULL', 'l.is_deleted = FALSE'];

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`(l.name ILIKE $${values.length} OR l.description ILIKE $${values.length})`);
  }

  if (query.destination_id) {
    values.push(query.destination_id);
    clauses.push(`l.destination_id = $${values.length}`);
  }

  return {
    text: `WHERE ${clauses.join(' AND ')}`,
    values,
  };
};

module.exports = {
  async findAllWithPagination(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const sortBy = SORT_COLUMNS[query.sortBy] || SORT_COLUMNS.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM location l
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
    const result = await db.query(
      `SELECT
          l.location_id,
          l.name,
          l.latitude,
          l.longitude,
          l.description,
          l.thumbnail,
          l.destination_id AS travel_destination_id,
          td.name AS travel_destination_name,
          (
            SELECT COUNT(*)::int
            FROM map m
            WHERE m.location_id = l.location_id
              AND m.deleted_at IS NULL
              AND m.is_deleted = FALSE
          ) AS map_count,
          l.created_at,
          l.updated_at
       FROM location l
       LEFT JOIN travel_destination td ON td.destination_id = l.destination_id
       ${where.text}
       ORDER BY ${sortBy} ${sortOrder}, l.location_id DESC
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );

    return {
      items: result.rows,
      pagination: {
        page,
        limit,
        total: countResult.rows[0].total,
      },
    };
  },

  async findActiveById(id, executor = db) {
    const result = await executor.query(
      'SELECT * FROM location WHERE location_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE',
      [id]
    );

    return result.rows[0] || null;
  },

  async findExistingActiveIds(ids, executor = db) {
    if (!ids.length) return [];
    const result = await executor.query(
      `SELECT location_id
       FROM location
       WHERE location_id = ANY($1::int[])
         AND deleted_at IS NULL
         AND is_deleted = FALSE`,
      [ids]
    );
    return result.rows.map((row) => Number(row.location_id));
  },

  async travelDestinationExists(destinationId, executor = db) {
    const result = await executor.query(
      'SELECT destination_id FROM travel_destination WHERE destination_id = $1 AND deleted_at IS NULL',
      [destinationId]
    );

    return Boolean(result.rows[0]);
  },

  async findDuplicateName(destinationId, name, exceptLocationId, executor = db) {
    const values = [destinationId, name];
    let exceptClause = '';
    if (exceptLocationId) {
      values.push(exceptLocationId);
      exceptClause = `AND location_id <> $${values.length}`;
    }

    const result = await executor.query(
      `SELECT location_id
       FROM location
       WHERE destination_id = $1
         AND LOWER(name) = LOWER($2)
         AND deleted_at IS NULL
         AND is_deleted = FALSE
         ${exceptClause}`,
      values
    );

    return result.rows[0] || null;
  },

  async createLocation(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO location
         (destination_id, name, description, latitude, longitude, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        payload.destination_id,
        payload.name,
        payload.description,
        payload.latitude,
        payload.longitude,
        payload.thumbnail,
      ]
    );

    return result.rows[0];
  },

  async updateLocation(id, payload, executor = db) {
    const fields = ['name', 'description', 'latitude', 'longitude', 'thumbnail']
      .filter((field) => payload[field] !== undefined);

    if (!fields.length) {
      return this.findActiveById(id, executor);
    }

    const values = fields.map((field) => payload[field]);
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
    values.push(id);

    const result = await executor.query(
      `UPDATE location
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE location_id = $${values.length}
         AND deleted_at IS NULL
         AND is_deleted = FALSE
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async countRelatedData(id, executor = db) {
    const result = await executor.query(
      `SELECT
          (
            SELECT COUNT(*)::int
            FROM view360
            WHERE location_id = $1 AND deleted_at IS NULL
          ) AS total_view360,
          (
            SELECT COUNT(*)::int
            FROM view360_image vi
            INNER JOIN view360 v ON v.view_id = vi.view_id
            WHERE v.location_id = $1
              AND v.deleted_at IS NULL
              AND vi.deleted_at IS NULL
          ) AS total_view360_images,
          (
            SELECT COUNT(*)::int
            FROM map
            WHERE location_id = $1
          ) AS total_maps,
          (
            SELECT COUNT(*)::int
            FROM review
            WHERE location_id = $1
          ) AS total_reviews,
          (
            SELECT COUNT(*)::int
            FROM blog_location
            WHERE location_id = $1
          ) AS total_blog_locations`,
      [id]
    );

    return result.rows[0];
  },

  async softDeleteLocation(id, executor = db) {
    const result = await executor.query(
      `UPDATE location
       SET deleted_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP,
           is_deleted = TRUE
       WHERE location_id = $1 AND deleted_at IS NULL AND is_deleted = FALSE
       RETURNING *`,
      [id]
    );

    return result.rows[0] || null;
  },

  getClient() {
    return db.getClient();
  },
};

