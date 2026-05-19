const db = require('../config/db');

const buildWhere = (filters = {}, allowed = []) => {
  const entries = Object.entries(filters).filter(([key, value]) => allowed.includes(key) && value !== undefined);
  const values = [];
  const clauses = entries.map(([key, value], index) => {
    values.push(value);
    return `${key} = $${index + 1}`;
  });

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

class BaseModel {
  constructor({ table, primaryKey, fields, searchable = [], filters = [] }) {
    this.table = table;
    this.primaryKey = primaryKey;
    this.fields = fields;
    this.searchable = searchable;
    this.filters = filters;
  }

  async findAll(query = {}) {
    const { page = 1, limit = 20, search, ...filters } = query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = buildWhere(filters, this.filters);
    const values = [...where.values];
    let whereText = where.text;

    if (search && this.searchable.length) {
      const searchClauses = this.searchable.map((field) => `${field} ILIKE $${values.length + 1}`);
      values.push(`%${search}%`);
      whereText = whereText
        ? `${whereText} AND (${searchClauses.join(' OR ')})`
        : `WHERE (${searchClauses.join(' OR ')})`;
    }

    values.push(Number(limit), offset);
    const result = await db.query(
      `SELECT * FROM ${this.table} ${whereText} ORDER BY ${this.primaryKey} DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values
    );
    return result.rows;
  }

  async findById(id) {
    const result = await db.query(`SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`, [id]);
    return result.rows[0] || null;
  }

  async create(payload) {
    const keys = this.fields.filter((field) => payload[field] !== undefined);
    const values = keys.map((field) => payload[field]);
    const placeholders = keys.map((_, index) => `$${index + 1}`);
    const result = await db.query(
      `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id, payload) {
    const keys = this.fields.filter((field) => payload[field] !== undefined);
    if (!keys.length) {
      return this.findById(id);
    }

    const values = keys.map((field) => payload[field]);
    values.push(id);
    const assignments = keys.map((field, index) => `${field} = $${index + 1}`);
    const result = await db.query(
      `UPDATE ${this.table} SET ${assignments.join(', ')} WHERE ${this.primaryKey} = $${values.length} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async remove(id) {
    const result = await db.query(`DELETE FROM ${this.table} WHERE ${this.primaryKey} = $1 RETURNING *`, [id]);
    return result.rows[0] || null;
  }
}

module.exports = BaseModel;

