const createCrudRoute = require('./crud.route');
const controller = require('../controllers/bookingDetail.controller');
const { entity } = require('../validators');

module.exports = createCrudRoute(controller, entity.bookingDetail);

