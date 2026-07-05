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
      '038_add_blog_publishing_fields.sql'
    );
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await db.query(sql);

    const verification = await db.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_name = 'blog'
         AND column_name IN ('slug', 'thumbnail', 'status', 'published_at')
       ORDER BY column_name`
    );

    console.log('Migration 038 completed successfully.');
    console.table(verification.rows);
  } finally {
    await db.pool.end();
  }
};

run().catch((error) => {
  console.error('Migration 038 failed:', error.message);
  process.exitCode = 1;
});
