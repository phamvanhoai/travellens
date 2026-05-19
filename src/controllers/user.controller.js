const createController = require('./base.controller');
const userService = require('../services/user.service');

module.exports = createController(userService);

