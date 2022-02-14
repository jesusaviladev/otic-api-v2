const usersRouter = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const { validateCreate } = require('../middlewares/validation.js');

const { getUsers, getUserById, createUser, editUser, deleteUser } =
	usersController;

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUserById);

usersRouter.post('/', validateCreate, createUser);

usersRouter.patch('/:id', editUser);

usersRouter.delete('/:id', deleteUser);

module.exports = usersRouter;
