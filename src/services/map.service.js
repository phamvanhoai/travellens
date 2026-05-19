const BaseService = require('./base.service');
const mapModel = require('../models/map.model');

module.exports = new BaseService(mapModel);

