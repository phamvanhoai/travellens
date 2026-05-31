const express = require('express');
const controller = require('../controllers/tour.controller');
const validate = require('../middlewares/validate.middleware');
const { tour } = require('../validators');

const router = express.Router();

router
  .route('/')
  .get(validate(tour.list), controller.viewTourList)
  .post(validate(tour.create), controller.create);

router
  .route('/:id')
  .get(validate(tour.detail), controller.viewTourDetail)
  .put(validate(tour.update), controller.update)
  .delete(validate(tour.remove), controller.remove);

module.exports = router;
