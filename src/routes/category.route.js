const createCrudRoute = require('./crud.route');
const controller = require('../controllers/category.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.category);

