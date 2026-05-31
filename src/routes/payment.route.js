const createCrudRoute = require('./crud.route');
const controller = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const { common, entity } = require('../validators');

const router = createCrudRoute(controller, entity.payment);

router.patch('/:id/refund', validate({ params: common.idParam }), controller.refund);

router.patch('/:id/status', validate({ params: common.idParam, body: entity.paymentStatus,}), controller.updateStatus);
module.exports = router;

