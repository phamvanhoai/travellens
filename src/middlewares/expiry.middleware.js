const logger = require('../config/logger');
const expiryService = require('../services/expiry.service');

const SWEEP_INTERVAL_MS = Number(process.env.EXPIRY_SWEEP_INTERVAL_MS || 30000);
let lastSweepAt = 0;
let activeSweep = null;

module.exports = async (req, res, next) => {
  const now = Date.now();
  if (!activeSweep && now - lastSweepAt >= SWEEP_INTERVAL_MS) {
    lastSweepAt = now;
    activeSweep = expiryService.sweepExpiredBookings()
      .catch((error) => {
        logger.error('Expiry sweep failed', { error: error.message });
      })
      .finally(() => {
        activeSweep = null;
      });
  }

  if (activeSweep) await activeSweep;
  next();
};
