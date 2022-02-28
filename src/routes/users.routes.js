const usersRouter = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const { verifyToken, checkAdmin } = require('../middlewares/auth.js')
const {
	validateUser,
	validateEditedUser,
	validatePagination,
} = require('../middlewares/validation.js');

const { getUsers, getUserById, createUser, editUser, deleteUser } =
	usersController;

usersRouter.get('/', verifyToken, checkAdmin, validatePagination, getUsers);

usersRouter.get('/:id', verifyToken, getUserById);

usersRouter.post('/', verifyToken, checkAdmin, validateUser, createUser);

usersRouter.patch('/:id', verifyToken, validateEditedUser, editUser);

usersRouter.delete('/:id', verifyToken, checkAdmin, deleteUser);

module.exports = usersRouter;
