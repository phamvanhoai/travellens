const express = require('express');
const controller = require('../controllers/statistics.controller');
const validate = require('../middlewares/validate.middleware');
const { common, entity } = require('../validators');

const router = express.Router();

router.get('/dashboard/summary', controller.dashboard);
router.get('/', validate({ query: common.paginationQuery }), controller.list);
router.post('/', validate({ body: entity.statistics }), controller.create);
router.get('/:id', validate({ params: common.idParam }), controller.get);
router.put('/:id', validate({ params: common.idParam }), controller.update);
router.delete('/:id', validate({ params: common.idParam }), controller.remove);

module.exports = router;

