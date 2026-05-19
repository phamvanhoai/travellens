const express = require('express');
const suggestionController = require('../controllers/suggestion.controller');

const router = express.Router();

router.post('/', suggestionController.suggest);

module.exports = router;

