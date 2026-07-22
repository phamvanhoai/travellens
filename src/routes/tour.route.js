const express = require('express');
const controller = require('../controllers/tour.controller');
const validate = require('../middlewares/validate.middleware');
const { handleTourThumbnailUpload } = require('../middlewares/upload.middleware');
const { tour } = require('../validators');
const departureController = require('../controllers/tourDeparture.controller');
const departureValidator = require('../validators/tourDeparture.validator');

const router = express.Router();

router.get('/:tourId/departures', validate(departureValidator.list), departureController.adminList);
router.post('/:tourId/departures/bulk', validate(departureValidator.bulkCreate), departureController.bulkCreate);
router.post('/:tourId/departures', validate(departureValidator.create), departureController.create);
router.put('/:tourId/departures/:departureId', validate(departureValidator.update), departureController.update);
router.delete('/:tourId/departures/:departureId', validate(departureValidator.remove), departureController.remove);

router
  .route('/')
  .get(validate(tour.list), controller.viewTourList)
  .post(handleTourThumbnailUpload, validate(tour.create), controller.create);

router
  .route('/:id')
  .get(validate(tour.detail), controller.viewTourDetail)
  .put(handleTourThumbnailUpload, validate(tour.update), controller.update)
  .delete(validate(tour.remove), controller.remove);

module.exports = router;
