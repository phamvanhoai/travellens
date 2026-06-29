require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const migrations = [
  '023_add_booking_cancel_metadata.sql',
  '024_add_tour_start_at.sql',
  '025_create_refund_request.sql',
  '026_create_booking_status_history.sql',
  '027_add_booking_departure_at.sql',
];

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const sslConfig = shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {};

const dbConfig = process.env.DATABASE_URL
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

const run = async () => {
  const pool = new Pool(dbConfig);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const fileName of migrations) {
      const filePath = path.join(__dirname, '..', 'migrations', fileName);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running ${fileName}...`);
      await client.query(sql);
      console.log(`Done ${fileName}`);
    }

    await client.query('COMMIT');
    console.log('All cancel booking migrations completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed. Rolled back changes.');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

run();
