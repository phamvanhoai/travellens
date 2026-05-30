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
      { name: 'Admin Users', description: 'Admin user management' },
      { name: 'Admin Statistics', description: 'Admin dashboard and reporting endpoints' },
      { name: 'Admin Travel Destinations', description: 'Admin travel destination management' },
      { name: 'Admin Locations', description: 'Admin location management' },
      { name: 'Admin Maps', description: 'Admin map management' },
      { name: 'Locations', description: 'Public read-only location endpoints' },
      { name: 'Navigation', description: 'Customer route navigation endpoints' },
      { name: 'Admin View360', description: 'Admin 360 virtual scene and image management' },
      { name: 'Admin Destination Categories', description: 'Admin destination category management' },
      { name: 'Admin Tour Categories', description: 'Admin tour category management' },
      { name: 'Admin Tours', description: 'Admin tour viewing endpoints' },
      { name: 'Staff Coupons', description: 'Staff coupon management endpoints' },
      { name: 'Staff Bookings', description: 'Staff booking management endpoints' },
      { name: 'Staff Reviews', description: 'Staff review moderation endpoints' },
      { name: 'Staff Payments', description: 'Staff payment management endpoints' },
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
