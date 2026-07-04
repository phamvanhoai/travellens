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
  const client = await pool.connect();

  try {
    const filePath = path.join(
      __dirname,
      '..',
      'migrations',
      '031_add_manual_booking_confirmation_status.sql'
    );
    await client.query(fs.readFileSync(filePath, 'utf8'));

    const result = await client.query(
      `SELECT pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
       WHERE conname = 'booking_status_check'
         AND conrelid = 'booking'::regclass`
    );

    console.log('Migration 031 completed successfully.');
    console.log(result.rows[0]?.definition || 'booking_status_check was not found.');
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(`Migration 031 failed: ${error.message}`);
  process.exitCode = 1;
});
