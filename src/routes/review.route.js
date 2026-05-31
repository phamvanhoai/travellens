const createCrudRoute = require('./crud.route');
const controller = require('../controllers/review.controller');
const { entity } = require('../validators');

const router = createCrudRoute(controller, entity.review);

router.use('/:reviewId/photos', require('./reviewPhoto.route'));

module.exports = router;

