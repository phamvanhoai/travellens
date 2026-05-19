require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { cors, logger } = require('./config');
const routes = require('./routes');
const limiter = require('./middlewares/rateLimiter.middleware');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const swaggerSpec = require('./docs/swagger');
const startBookingExpiryJob = require('./jobs/bookingExpiry.job');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors);
app.use(limiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    logger.info(`Travel360 API listening on port ${port}`);
  });
  startBookingExpiryJob();
}

module.exports = app;

