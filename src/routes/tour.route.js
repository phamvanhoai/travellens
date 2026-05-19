const createCrudRoute = require('./crud.route');
const controller = require('../controllers/tour.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.tour);

