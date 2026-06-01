const createCrudRoute = require('./crud.route');
const controller = require('../controllers/booking.controller');
const validate = require('../middlewares/validate.middleware');
const { common, entity } = require('../validators');

const router = createCrudRoute(controller, entity.booking);

router.patch('/:id/cancel', validate({ params: common.idParam }), controller.cancel);

module.exports = router;
