require('dotenv').config();

const db = require('../src/config/db');

async function run() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE tour
       SET booking_policy = regexp_replace(
             booking_policy,
             'Đặt trước tối thiểu[[:space:]]+[0-9]+[[:space:]]+giờ\\.?',
             'Đặt trước tối thiểu 4 giờ.',
             'gi'
           ),
           updated_at = CURRENT_TIMESTAMP
       WHERE deleted_at IS NULL
         AND booking_policy ~* 'Đặt trước tối thiểu[[:space:]]+[0-9]+[[:space:]]+giờ'
         AND booking_policy !~* 'Đặt trước tối thiểu[[:space:]]+4[[:space:]]+giờ'
       RETURNING tour_id, name, booking_policy`
    );
    await client.query('COMMIT');
    console.log(JSON.stringify({ success: true, updated: result.rowCount, tours: result.rows }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await db.pool.end();
  }
}

run().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
