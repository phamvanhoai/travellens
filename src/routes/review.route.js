const createCrudRoute = require('./crud.route');
const controller = require('../controllers/review.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.review);
