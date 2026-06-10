const db = require('../config/db');
const BaseModel = require('./base.model');

const SORT_COLUMNS = {
  user_id: 'user_id',
  name: 'name',
  email: 'email',
  role: 'role',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

const buildListWhere = (query = {}) => {
  const values = [];
  const clauses = [];

  if (query.search) {
    values.push(`%${query.search}%`);
    clauses.push(
      `(name ILIKE $${values.length}
        OR email ILIKE $${values.length}
        OR phone ILIKE $${values.length}
        OR address ILIKE $${values.length})`
    );
  }

  if (query.role) {
    values.push(query.role);
    clauses.push(`role = $${values.length}`);
  }

  if (query.status) {
    values.push(query.status);
    clauses.push(`status = $${values.length}`);
  }

  return {
    text: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
};

class UserModel extends BaseModel {
  constructor() {
    super({
      table: 'users',
      primaryKey: 'user_id',
      fields: [
        'name',
        'email',
        'password',
        'role',
        'status',
        'profile_info',
        'google_id',
        'avatar_url',
        'phone',
        'date_of_birth',
        'gender',
        'address',
      ],
      searchable: ['name', 'email', 'phone', 'address'],
      filters: ['role', 'status', 'google_id'],
    });
  }

  async findAllWithPagination(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 10), 1), 100);
    const offset = (page - 1) * limit;
    const where = buildListWhere(query);
    const sortBy = SORT_COLUMNS[query.sortBy] || SORT_COLUMNS.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM users
       ${where.text}`,
      where.values
    );

    const values = [...where.values, limit, offset];
    const result = await db.query(
      `SELECT
          user_id,
          name,
          email,
          role,
          status,
          profile_info,
          google_id,
          avatar_url,
          phone,
          date_of_birth,
          gender,
          address,
          created_at,
          updated_at
       FROM users
       ${where.text}
       ORDER BY ${sortBy} ${sortOrder}, user_id DESC
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
  }

  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await db.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    return result.rows[0] || null;
  }

  async existsByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await db.query('SELECT user_id FROM users WHERE email = $1', [normalizedEmail]);
    return Boolean(result.rows[0]);
  }

  async findByEmailOrGoogleId(email, googleId) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await db.query('SELECT * FROM users WHERE email = $1 OR google_id = $2', [
      normalizedEmail,
      googleId,
    ]);
    return result.rows[0] || null;
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
      `UPDATE ${this.table}
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE ${this.primaryKey} = $${values.length}
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async verifyGuestUser(userId) {
    const result = await db.query(
      `UPDATE users
       SET role = 'customer', status = 'active'
       WHERE user_id = $1 AND role = 'guest'
       RETURNING *`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async updatePassword(userId, hashedPassword) {
    const result = await db.query(
      `UPDATE users
       SET password = $1
       WHERE user_id = $2
       RETURNING *`,
      [hashedPassword, userId]
    );

    return result.rows[0] || null;
  }

}

module.exports = new UserModel();
