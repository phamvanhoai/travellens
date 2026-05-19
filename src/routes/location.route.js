const createCrudRoute = require('./crud.route');
const controller = require('../controllers/location.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.location);

