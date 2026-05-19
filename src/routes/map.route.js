const createCrudRoute = require('./crud.route');
const controller = require('../controllers/map.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.map);

