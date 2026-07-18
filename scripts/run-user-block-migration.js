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
      '041_create_user_block.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await db.query(sql);

    const verification = await db.query(
      `SELECT 'user_block_table' AS check_name, EXISTS (
         SELECT 1
         FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name = 'user_block'
       ) AS exists`
    );

    console.log('Migration 041 completed successfully.');
    console.table(verification.rows);
  } finally {
    await db.pool.end();
  }
};

run().catch((error) => {
  console.error('Migration 041 failed:', error.message);
  process.exitCode = 1;
});
