const BaseModel = require('./base.model');
const db = require('../config/db');

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = ['m.deleted_at IS NULL', 'm.is_deleted = FALSE'];

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(`m.title ILIKE $${values.length}`);
  }

  if (query.location_id) {
    values.push(query.location_id);
    clauses.push(`m.location_id = $${values.length}`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

const mapModel = new BaseModel({
  table: 'map',
  primaryKey: 'map_id',
  fields: ['location_id', 'title', 'map_file', 'description', 'display_order'],
  searchable: ['title'],
  filters: ['location_id'],
});

mapModel.findAllWithPagination = async (query = {}) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
  const offset = (page - 1) * limit;
  const where = buildListWhere(query);

  const countResult = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM map m
     ${where.text}`,
    where.values
  );

  const values = [...where.values, limit, offset];
  const result = await db.query(
    `SELECT
        m.map_id,
        m.title,
        m.location_id,
        l.name AS location_name,
        m.map_file,
        m.description,
        m.display_order
     FROM map m
     LEFT JOIN location l ON l.location_id = m.location_id
     ${where.text}
     ORDER BY m.display_order ASC NULLS LAST, m.map_id DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return {
    items: result.rows,
    pagination: {
      page,
      limit,
      total: countResult.rows[0].total,
      totalPages: Math.ceil(countResult.rows[0].total / limit),
    },
  };
};

mapModel.findActiveById = async (id) => {
  const result = await db.query(
    `SELECT *
     FROM map
     WHERE map_id = $1
       AND deleted_at IS NULL
       AND is_deleted = FALSE`,
    [id]
  );

  return result.rows[0] || null;
};

mapModel.updateMap = async (id, payload) => {
  const fields = ['title', 'description', 'map_file', 'display_order']
    .filter((field) => payload[field] !== undefined);

  if (!fields.length) {
    return mapModel.findById(id);
  }

  const values = fields.map((field) => payload[field]);
  values.push(id);
  const assignments = fields.map((field, index) => `${field} = $${index + 1}`);

  const result = await db.query(
    `UPDATE map
     SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE map_id = $${values.length}
       AND deleted_at IS NULL
       AND is_deleted = FALSE
     RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

mapModel.softDeleteMap = async (id) => {
  const result = await db.query(
    `UPDATE map
     SET is_deleted = TRUE,
         deleted_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE map_id = $1
       AND deleted_at IS NULL
       AND is_deleted = FALSE
     RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
};

module.exports = mapModel;

