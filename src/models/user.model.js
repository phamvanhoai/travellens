const db = require('../config/db');
const BaseModel = require('./base.model');

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
      searchable: ['name', 'email'],
      filters: ['role', 'status', 'google_id'],
    });
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
    const result = await db.query(`UPDATE users SET role = 'user',status = 'active' WHERE user_id = $1 AND role = 'guest' RETURNING *`, [
      userId
    ]);
    return result.rows[0] || null;
  }

  async updatePassword(userId, hashedPassword) {
    const result = await db.query(`UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *`, [
      hashedPassword, userId
    ]);

    return result.rows[0] || null;
  }

}

module.exports = new UserModel();
