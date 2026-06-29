const rateLimit = require('express-rate-limit');

const defaultLimit = process.env.NODE_ENV === 'production' ? 200 : 5000;

module.exports = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX || defaultLimit),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
