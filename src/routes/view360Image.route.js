const createCrudRoute = require('./crud.route');
const controller = require('../controllers/view360Image.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.view360Image);

