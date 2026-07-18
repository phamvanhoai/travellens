require('dotenv').config();

const db = require('../src/config/db');

(async () => {
  try {
    const result = await db.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name IN ('group_trip', 'group_trip_member', 'group_trip_invite')
       ORDER BY table_name`
    );

    console.log(result.rows.map((row) => row.table_name).join(', '));
  } catch (error) {
    console.error('Failed to check group trip schema:', error.message || error.code);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
})();
