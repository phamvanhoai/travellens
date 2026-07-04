const cron = require('node-cron');
const logger = require('../config/logger');
const expiryService = require('../services/expiry.service');

const startPaymentExpiryJob = () => {
  cron.schedule('*/1 * * * *', async () => {
    try {
      const result = await expiryService.sweepExpiredBookings();
      if (
        result.payments
        || result.bookings
        || result.manualBookings
        || result.unpaidBookings
      ) {
        logger.info('Expired payments and bookings', result);
      }
    } catch (error) {
      logger.error('Payment expiry job failed', { error: error.message });
    }
  });
};

module.exports = startPaymentExpiryJob;
