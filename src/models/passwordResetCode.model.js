const crypto = require('crypto');
const db = require('../config/db');

class PasswordResetCodeModel {
    constructor() {
        this.table = 'password_reset_codes';
    }

    generateCode() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    generateRawToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    hashValue(value) {
        return crypto.createHash('sha256').update(value).digest('hex');
    }

    async createCode(userId) {
        const rawCode = this.generateCode();
        const codeHash = this.hashValue(rawCode);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db.query(
            `INSERT INTO ${this.table} (user_id, code_hash, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, codeHash, expiresAt]
        );

        return {
            rawCode,
            expiresAt,
        };
    }

    async findValidCode(userId, code) {
        const codeHash = this.hashValue(code);

        const result = await db.query(
            `SELECT *
       FROM ${this.table}
       WHERE user_id = $1
         AND code_hash = $2
         AND verified_at IS NULL
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC
       LIMIT 1`,
            [userId, codeHash]
        );

        return result.rows[0] || null;
    }

    async verifyCode(resetCodeId) {
        const rawResetToken = this.generateRawToken();
        const resetTokenHash = this.hashValue(rawResetToken);

        const result = await db.query(
            `UPDATE ${this.table}
       SET verified_at = CURRENT_TIMESTAMP,
           reset_token_hash = $1
       WHERE reset_code_id = $2
       RETURNING *`,
            [resetTokenHash, resetCodeId]
        );

        return {
            record: result.rows[0] || null,
            rawResetToken,
        };
    }

    async findValidResetToken(resetToken) {
        const resetTokenHash = this.hashValue(resetToken);

        const result = await db.query(
            `SELECT *
       FROM ${this.table}
       WHERE reset_token_hash = $1
         AND verified_at IS NOT NULL
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
            [resetTokenHash]
        );

        return result.rows[0] || null;
    }

    async markAsUsed(resetCodeId) {
        const result = await db.query(
            `UPDATE ${this.table}
       SET used_at = CURRENT_TIMESTAMP
       WHERE reset_code_id = $1
       RETURNING *`,
            [resetCodeId]
        );

        return result.rows[0] || null;
    }
}

module.exports = new PasswordResetCodeModel();