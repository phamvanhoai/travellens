const cors = require('cors');

const defaultDevelopmentOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .join(',');

const allowedOrigins = configuredOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = cors({
  origin(origin, callback) {
    const isDevelopmentLocalhost = process.env.NODE_ENV !== 'production'
      && defaultDevelopmentOrigins.includes(origin);

    if (!origin || allowedOrigins.includes(origin) || isDevelopmentLocalhost) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});
