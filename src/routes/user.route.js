const createCrudRoute = require('./crud.route');
const controller = require('../controllers/user.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.user);
