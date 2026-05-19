const createController = require('./base.controller');
const mapService = require('../services/map.service');

module.exports = createController(mapService);

