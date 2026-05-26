const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel360 API',
      version: '1.0.0',
      description: 'Backend API for travel booking, 360 views, maps, blogs, reviews, statistics, and AI suggestions.',
    },
    tags: [
      { name: 'Auth', description: 'Authentication and profile endpoints' },
      { name: 'Admin Statistics', description: 'Admin dashboard and reporting endpoints' },
      { name: 'Admin Travel Destinations', description: 'Admin travel destination management' },
      { name: 'Admin Locations', description: 'Admin location management' },
      { name: 'Admin Maps', description: 'Admin map management' },
      { name: 'Admin View360', description: 'Admin 360 virtual scene and image management' },
      { name: 'Admin Destination Categories', description: 'Admin destination category management' },
      { name: 'Admin Tour Categories', description: 'Admin tour category management' },
      { name: 'Staff', description: 'Staff operations for bookings, reviews, coupons, and payments' },
      { name: 'DestinationCategories', description: 'Public destination category endpoints' },
      { name: 'TourCategories', description: 'Public tour category endpoints' },
      { name: 'Coupons', description: 'Coupon endpoints' },
    ],
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
