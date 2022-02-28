const authRouter = require('express').Router();
const { signup, login } = require('../controllers/authentication.controller.js');
const { validateLogin } = require('../middlewares/validation.js')

//authRouter.post('/signup', signup);

authRouter.post('/login', validateLogin, login);

module.exports = authRouter;
