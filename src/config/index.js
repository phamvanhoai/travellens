require('dotenv').config();

module.exports = {
  db: require('./db'),
  cors: require('./cors'),
  logger: require('./logger'),
};

