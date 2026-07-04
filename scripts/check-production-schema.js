require('dotenv').config();

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
    const columns = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'tour'
         AND column_name = 'child_price'`
    );
    const constraint = await pool.query(
      `SELECT pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
       WHERE conname = 'booking_status_check'
         AND conrelid = 'booking'::regclass`
    );

    console.log(`tour.child_price: ${columns.rowCount ? 'present' : 'missing'}`);
    console.log(`booking_status_check: ${constraint.rows[0]?.definition || 'missing'}`);
  } finally {
    await pool.end();
  }
};

run().catch((error) => {
  console.error(`Schema check failed: ${error.message}`);
  process.exitCode = 1;
});
