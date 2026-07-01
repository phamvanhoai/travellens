const express = require('express');
const controller = require('../controllers/travelDestination.controller');
const validate = require('../middlewares/validate.middleware');
const { common } = require('../validators');

const router = express.Router();

router.get('/', validate({ query: common.travelDestinationListQuery }), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
