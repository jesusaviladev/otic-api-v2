const authRouter = require('express').Router();
const { login } = require('../controllers/authentication.controller.js');
const { validateLogin } = require('../middlewares/validation.js')

authRouter.post('/login', validateLogin, login);

module.exports = authRouter;
