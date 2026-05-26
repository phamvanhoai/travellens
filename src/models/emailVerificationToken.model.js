const crypto = require('crypto');
const db = require('../config/db');

class EmailVerificationTokenModel {
    constructor() {
        this.table = 'email_verification_tokens';
    }

    generateRawToken() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async createToken(userId) {
        const rawToken = this.generateRawToken();
        const tokenHash = this.hashToken(rawToken);

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

        await db.query(
            `INSERT INTO ${this.table} (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );

        return {
            rawToken,
            expiresAt,
        };
    }

    async findValidToken(token) {
        const tokenHash = this.hashToken(token);

        const result = await db.query(
            `SELECT *
       FROM ${this.table}
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
            [tokenHash]
        );

        return result.rows[0] || null;
    }

    async findValidCode(userId, otp) {
        const tokenHash = this.hashToken(otp);

        const result = await db.query(
            `SELECT *
       FROM ${this.table}
       WHERE user_id = $1
         AND token_hash = $2
         AND used_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       ORDER BY created_at DESC
       LIMIT 1`,
            [userId, tokenHash]
        );

        return result.rows[0] || null;
    }

    async markAsUsed(verificationId) {
        const result = await db.query(
            `UPDATE ${this.table}
       SET used_at = CURRENT_TIMESTAMP
       WHERE verification_id = $1
       RETURNING *`,
            [verificationId]
        );

        return result.rows[0] || null;
    }
}

module.exports = new EmailVerificationTokenModel();