const createController = require('./base.controller');
const locationService = require('../services/location.service');

module.exports = createController(locationService);

