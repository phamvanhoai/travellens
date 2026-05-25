const db = require('../config/db');
const BaseModel = require('./base.model');

class UserModel extends BaseModel {
  constructor() {
    super({
      table: 'users',
      primaryKey: 'user_id',
      fields: ['name', 'email', 'password', 'role', 'status', 'profile_info', 'google_id', 'avatar_url'],
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
}

module.exports = new UserModel();