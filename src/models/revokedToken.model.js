const crypto = require('crypto');
const db = require('../config/db');

class RevokedTokenModel {
  constructor() {
    this.table = 'revoked_tokens';
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async revoke({ token, userId, expiresAt }) {
    const tokenHash = this.hashToken(token);
    const result = await db.query(
      `INSERT INTO ${this.table} (token_hash, user_id, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (token_hash) DO UPDATE
       SET user_id = EXCLUDED.user_id,
           expires_at = EXCLUDED.expires_at
       RETURNING *`,
      [tokenHash, userId || null, expiresAt]
    );

    return result.rows[0];
  }

  async isRevoked(token) {
    const tokenHash = this.hashToken(token);
    const result = await db.query(
      `SELECT revoked_token_id
       FROM ${this.table}
       WHERE token_hash = $1
         AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
      [tokenHash]
    );

    return Boolean(result.rows[0]);
  }

  async removeExpired() {
    const result = await db.query(
      `DELETE FROM ${this.table}
       WHERE expires_at <= CURRENT_TIMESTAMP
       RETURNING *`
    );

    return result.rows;
  }
}

module.exports = new RevokedTokenModel();