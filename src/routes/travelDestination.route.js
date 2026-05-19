const createCrudRoute = require('./crud.route');
const controller = require('../controllers/travelDestination.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.travelDestination);

