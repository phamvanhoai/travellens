const BaseService = require('./base.service');
const travelDestinationModel = require('../models/travelDestination.model');

module.exports = new BaseService(travelDestinationModel);

