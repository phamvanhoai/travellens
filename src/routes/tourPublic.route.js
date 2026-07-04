const express = require('express');
const controller = require('../controllers/tour.controller');
const validate = require('../middlewares/validate.middleware');
const { tour } = require('../validators');

const router = express.Router();

router.get('/', validate(tour.list), controller.publicList);
router.get('/:id', validate(tour.detail), controller.publicDetail);

module.exports = router;
