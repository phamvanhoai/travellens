const path = require('path');
const winston = require('winston');

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

const transports = [
  new winston.transports.Console({
    format: isProduction
      ? winston.format.json()
      : winston.format.simple(),
  }),
];

if (!isProduction && !isVercel) {
  transports.push(
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') })
  );
}

const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;
