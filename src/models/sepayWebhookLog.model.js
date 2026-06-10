const db = require('../config/db');

module.exports = {
  async create(payload, executor = db) {
    const result = await executor.query(
      `INSERT INTO sepay_webhook_log
         (sepay_transaction_id, payment_id, payment_code, transfer_amount, transfer_type,
          raw_payload, status, message)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
       ON CONFLICT (sepay_transaction_id) DO NOTHING
       RETURNING *`,
      [
        payload.sepay_transaction_id,
        payload.payment_id || null,
        payload.payment_code || null,
        payload.transfer_amount || null,
        payload.transfer_type || null,
        JSON.stringify(payload.raw_payload),
        payload.status || 'received',
        payload.message || null,
      ]
    );
    return result.rows[0] || null;
  },

  async updateStatus(id, status, message, paymentId, executor = db) {
    const result = await executor.query(
      `UPDATE sepay_webhook_log
       SET status = $2,
           message = $3,
           payment_id = COALESCE($4, payment_id)
       WHERE sepay_webhook_log_id = $1
       RETURNING *`,
      [id, status, message || null, paymentId || null]
    );
    return result.rows[0] || null;
  },
};
