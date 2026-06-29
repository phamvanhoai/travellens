require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const sslConfig = shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {};
const dbConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ...sslConfig }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'travel360',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ...sslConfig,
    };

const run = async () => {
  const pool = new Pool(dbConfig);
  try {
    const filePath = path.join(__dirname, '..', 'migrations', '030_add_tour_child_price.sql');
    await pool.query(fs.readFileSync(filePath, 'utf8'));
    console.log('Migration 030 completed successfully.');
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(`Migration 030 failed: ${error.message}`);
  process.exitCode = 1;
});
