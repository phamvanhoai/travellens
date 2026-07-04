const { Pool, types } = require('pg');

// PostgreSQL TIMESTAMP has no timezone metadata. The database stores these
// values as Vietnam wall-clock time, so parse them consistently on Vercel (UTC)
// and local machines alike. OID 1114 is PostgreSQL's timestamp type.
const databaseUtcOffset = process.env.DB_TIMEZONE_OFFSET || '+07:00';
types.setTypeParser(1114, (value) => {
  if (!value || value === 'infinity' || value === '-infinity') return value;
  return new Date(`${value.replace(' ', 'T')}${databaseUtcOffset}`);
});

const shouldUseSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

const sslConfig = shouldUseSsl
  ? { ssl: { rejectUnauthorized: false } }
  : {};

const poolConfig = {
  // Serverless instances multiply connection pools. Keep each Vercel instance
  // small so it cannot exhaust a session pool with a low global client limit.
  max: Number(process.env.DB_POOL_MAX || (process.env.VERCEL ? 1 : 10)),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 10000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 10000),
  allowExitOnIdle: true,
  maxUses: Number(process.env.DB_MAX_USES || 500),
};

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...sslConfig,
      ...poolConfig,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'travel360',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ...sslConfig,
      ...poolConfig,
    };

const pool = new Pool(config);

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error', error);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
