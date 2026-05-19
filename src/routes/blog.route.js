const createCrudRoute = require('./crud.route');
const controller = require('../controllers/blog.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.blog);

