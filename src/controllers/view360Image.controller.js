const createController = require('./base.controller');
const view360ImageService = require('../services/view360Image.service');

module.exports = createController(view360ImageService);

