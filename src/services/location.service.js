const BaseService = require('./base.service');
const locationModel = require('../models/location.model');

module.exports = new BaseService(locationModel);

