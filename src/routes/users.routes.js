const usersRouter = require("express").Router();
const usersController = require("../controllers/users.controller.js");

const { getUsers, getUserById, createUser, editUser, deleteUser } =
	usersController;

usersRouter.get("/", getUsers);

usersRouter.get("/:id", getUserById);

usersRouter.post("/", createUser);

usersRouter.put("/:id", editUser);

usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
