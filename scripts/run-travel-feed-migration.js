require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const sslConfig = shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {};

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...sslConfig,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'travel360',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ...sslConfig,
    };

const pool = new Pool(config);

const run = async () => {
  const migrationPath = path.join(__dirname, '..', 'migrations', '039_create_travel_feed_tables.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  await pool.query(sql);

  const result = await pool.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name IN (
         'travel_post',
         'travel_post_photo',
         'travel_post_like',
         'travel_post_comment',
         'travel_post_report'
       )
     ORDER BY table_name`
  );

  console.log(JSON.stringify({
    success: true,
    tables: result.rows.map((row) => row.table_name),
  }, null, 2));
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
