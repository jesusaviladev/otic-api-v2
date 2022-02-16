const usersRouter = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const {
	validateUser,
	validateEditedUser,
	validatePagination,
} = require('../middlewares/validation.js');

const { getUsers, getUserById, createUser, editUser, deleteUser } =
	usersController;

usersRouter.get('/', validatePagination, getUsers);

usersRouter.get('/:id', getUserById);

usersRouter.post('/', validateUser, createUser);

usersRouter.patch('/:id', validateEditedUser, editUser);

usersRouter.delete('/:id', deleteUser);

module.exports = usersRouter;
