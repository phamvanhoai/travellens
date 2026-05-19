const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { auth } = require('../validators');

const router = express.Router();

router.post('/register', validate(auth.register), authController.register);
router.post('/login', validate(auth.login), authController.login);
router.post('/google', validate(auth.googleLogin), authController.googleLogin);

module.exports = router;

