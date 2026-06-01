const express = require('express');
const controller = require('../controllers/map.controller');
const validate = require('../middlewares/validate.middleware');
const { common, map } = require('../validators');

const router = express.Router();

router.get('/travel', validate(map.travel), controller.travel);
router.use('/nearby', require('./nearby.route'));
router.use('/filter', require('./mapFilter.route'));
router.get('/', validate(map.list), controller.list);
router.get('/:id', validate({ params: common.idParam }), controller.get);

module.exports = router;
