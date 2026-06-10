require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { cors, db, logger } = require('./config');
const routes = require('./routes');
const limiter = require('./middlewares/rateLimiter.middleware');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const swaggerSpec = require('./docs/swagger');
const startBookingExpiryJob = require('./jobs/bookingExpiry.job');
const startPaymentExpiryJob = require('./jobs/paymentExpiry.job');

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
      'style-src': ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
      'font-src': ["'self'", 'https://cdn.jsdelivr.net', 'data:'],
    },
  },
}));
app.use(cors);
app.use(limiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/public', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '..', 'public')));

app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/api-docs/swagger-init.js', (req, res) => {
  res.type('application/javascript').send(`
window.onload = function () {
  window.ui = SwaggerUIBundle({
    url: '/api-docs/swagger.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: 'StandaloneLayout'
  });
};
`);
});

app.get(['/api-docs', '/api-docs/'], (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Travel360 API Docs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.6/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.6/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.32.6/swagger-ui-standalone-preset.js"></script>
    <script src="/api-docs/swagger-init.js"></script>
  </body>
</html>`);
});
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    logger.info(`Travel360 API listening on port ${port}`);
    logger.info(`Travel360 API docs available at http://localhost:${port}/api-docs`);
  });

  db.query('SELECT NOW() AS connected_at')
    .then((result) => {
      logger.info('Database connected successfully', {
        connected_at: result.rows[0].connected_at,
      });
    })
    .catch((error) => {
      logger.error('Database connection failed', { error: error.message });
    });

  startBookingExpiryJob();
  startPaymentExpiryJob();
}

module.exports = app;
