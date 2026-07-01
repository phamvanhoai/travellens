const express = require('express');
const controller = require('../controllers/savedItem.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/ids', controller.getSavedIds);
router.get('/tours', controller.listTours);
router.post('/tours/:id/toggle', controller.toggleTour);
router.get('/destinations', controller.listDestinations);
router.post('/destinations/:id/toggle', controller.toggleDestination);

module.exports = router;
