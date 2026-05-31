const createCrudRoute = require('./crud.route');
const controller = require('../controllers/review.controller');
const { entity } = require('../validators');
const { authenticate, authorize, } = require('../middlewares/auth.middleware');

const router = createCrudRoute(controller, entity.review);


// Staff Review Management
router.get(
  '/staff/list',
  authenticate,
  authorize('staff'),
  controller.list
);

router.delete(
  '/staff/:id',
  authenticate,
  authorize('staff'),
  controller.remove
);

module.exports = router;