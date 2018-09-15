var express = require('express');
var router = express.Router();

var userController = require('../controllers/user.controller');
var authController = require('../controllers/auth.controller');

/* GET users listing. */
router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/patch', authController.validToken, userController.patch);

module.exports = router;
