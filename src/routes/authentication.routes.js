const authRouter = require("express").Router();
const { signup, login } = require('../controllers/authentication.controller.js');

authRouter.post("/signup", signup);

authRouter.post("/login", login);

module.exports = authRouter;
