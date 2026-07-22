require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const ssl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {};
const config = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL, ...ssl } : {
  host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432), database: process.env.DB_NAME || 'travel360', user: process.env.DB_USER || 'postgres', password: process.env.DB_PASSWORD || 'postgres', ...ssl,
};
(async () => {
  const pool = new Pool(config);
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, '..', 'migrations', '056_create_tour_departure.sql'), 'utf8'));
    console.log('Migration 056 completed successfully.');
  } finally { await pool.end(); }
})().catch((error) => { console.error(`Migration 056 failed: ${error.message}`); process.exitCode = 1; });
