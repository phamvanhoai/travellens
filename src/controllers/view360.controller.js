const createController = require('./base.controller');
const view360Service = require('../services/view360.service');

module.exports = createController(view360Service);

