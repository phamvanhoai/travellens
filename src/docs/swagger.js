const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel360 API',
      version: '1.0.0',
      description: 'Backend API for travel booking, 360 views, maps, blogs, reviews, statistics, and AI suggestions.',
    },
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);

