const createCrudRoute = require('./crud.route');
const controller = require('../controllers/view360.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.view360);

