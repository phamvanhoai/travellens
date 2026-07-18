const rateLimit = require('express-rate-limit');

const positiveNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const isProduction = process.env.NODE_ENV === 'production';
const generalEnabled = process.env.RATE_LIMIT_ENABLED === undefined
  ? isProduction
  : process.env.RATE_LIMIT_ENABLED === 'true';

const generalLimiter = rateLimit({
  windowMs: positiveNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  limit: positiveNumber(process.env.RATE_LIMIT_MAX, isProduction ? 200 : 1000),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => !generalEnabled || req.method === 'OPTIONS',
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

module.exports = generalLimiter;

