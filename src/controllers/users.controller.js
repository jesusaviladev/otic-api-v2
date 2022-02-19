const usersController = {};
const getPagination = require('../utils/getPagination.js');
const {
	findUsers,
	findUserById,
	addUser,
	editUser,
	deleteUser,
} = require('../services/users.services.js');

usersController.getUsers = async (request, response, next) => {
	const { since_id = 0, limit = 10 } = request.query;
	const { cursor, queryLimit } = getPagination(since_id, limit);

	try {
		const users = await findUsers(cursor, queryLimit);

		let nextCursor = null;

		if (users.length > 0 && users.length > limit) {
			users.pop();
			nextCursor = `http://localhost:3000/api/users/?since_id=${
				users[users.length - 1].id
			}&limit=${limit}`;
		}

		return response.status(200).json({
			users,
			pagination: {
				nextPage: nextCursor,
			},
		});
	} catch (error) {
		next(error);
	}
};

usersController.getUserById = async (request, response, next) => {
	const { id } = request.params;

	try {
		const user = await findUserById(id);

		if (!user)
			return response.status(404).json({
				status: 'User not found',
			});

		return response.status(200).json({
			user,
		});
	} catch (error) {
		next(error);
	}
};

usersController.createUser = async (request, response, next) => {
	const data = request.body;

	try {
		const savedUser = await addUser(data);

		return response.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
};

usersController.editUser = async (request, response, next) => {
	const { id } = request.params;

	const data = request.body;

	try {
		const [editedUser] = await editUser(id, data);

		if (editedUser === 0)
			return response.status(404).json({
				status: 'User not found',
			});

		return response.status(200).json({
			message: 'Successfully edited user',
		});
	} catch (error) {
		next(error);
	}
};

usersController.deleteUser = async (request, response, next) => {
	const { id } = request.params;

	try {
		const isUserDeleted = await deleteUser(id);

		if (!isUserDeleted)
			return response.status(404).json({
				status: 'User not found',
			});

		return response.status(200).json({
			message: 'Successfully deleted user',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = usersController;