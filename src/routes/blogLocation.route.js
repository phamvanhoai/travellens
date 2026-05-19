const createCrudRoute = require('./crud.route');
const controller = require('../controllers/blogLocation.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.blogLocation);

