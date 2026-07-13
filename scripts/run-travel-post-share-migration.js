require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const run = async () => {
  try {
    const migrationPath = path.join(
      __dirname,
      '..',
      'migrations',
      '040_add_travel_post_share.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await db.query(sql);

    const verification = await db.query(
      `SELECT 'share_count_column' AS check_name, EXISTS (
         SELECT 1
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = 'travel_post'
           AND column_name = 'share_count'
       ) AS exists
       UNION ALL
       SELECT 'travel_post_share_table' AS check_name, EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name = 'travel_post_share'
       ) AS exists`
    );

    console.log('Migration 040 completed successfully.');
    console.table(verification.rows);
  } finally {
    await db.pool.end();
  }
};

run().catch((error) => {
  console.error('Migration 040 failed:', error.message);
  process.exitCode = 1;
});
