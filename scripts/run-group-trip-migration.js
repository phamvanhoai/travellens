require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

const migrationPath = path.join(__dirname, '..', 'migrations', '042_create_group_trip.sql');

(async () => {
  try {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await db.query(sql);
    console.log('Migration 042_create_group_trip.sql applied successfully');
  } catch (error) {
    console.error('Failed to apply group trip migration');
    console.error({
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack,
    });
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
})();
