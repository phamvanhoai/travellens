const createController = require('./base.controller');
const travelDestinationService = require('../services/travelDestination.service');

module.exports = createController(travelDestinationService);

