require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function run() {
  try {
    const migrationPath = path.join(
      __dirname,
      '..',
      'migrations',
      '058_align_cancellation_policy_with_24_hour_rule.sql',
    );
    await db.query(fs.readFileSync(migrationPath, 'utf8'));

    const [tourResult, itemResult] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS old_count FROM tour WHERE cancellation_policy ILIKE '%7 ngày%'"),
      db.query(
        "SELECT COUNT(*)::int AS old_count FROM tour_content_item WHERE type = 'cancellation_policy' AND content ILIKE '%7 ngày%'",
      ),
    ]);

    console.log(JSON.stringify({
      migration: '058',
      tour_old_policy_count: tourResult.rows[0].old_count,
      item_old_policy_count: itemResult.rows[0].old_count,
    }));
  } finally {
    await db.pool.end();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
