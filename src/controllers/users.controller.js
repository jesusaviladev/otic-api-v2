const usersController = {};
const {
	findUsers,
	findUserById,
	addUser,
	editUser,
	deleteUser,
	findUserRequests,
	findUserReports,
} = require('../services/users.services.js');

usersController.getUsers = async (request, response, next) => {
	const { page = 1, limit = 10 } = request.query;

	try {
		const users = await findUsers(page, limit);

		return response.status(200).json({
			users: users.rows,
			pagination: {
				currentPage: page,
				per_page: limit,
				total: users.count,
				next: `http://localhost:3001/api/users?page=${
					page + 1
				}&limit=${limit}`,
			},
		});
	} catch (error) {
		next(error);
	}
};

usersController.getUserById = async (request, response, next) => {
	const { id } = request.params;

	try {
		// autorizacion
		const reqUser = await findUserById(request.user.id);

		if (
			!reqUser ||
			(reqUser.role.name !== 'admin' && reqUser.id !== parseInt(id))
		) {
			return response.status(403).json({
				error: 'Unauthorized',
			});
		}

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

usersController.getUserRequests = async (req, res, next) => {
	const { id } = req.params;

	try {
		// autorizacion
		const user = await findUserById(req.user.id);

		if (!user || (user.role.name !== 'admin' && user.id !== parseInt(id))) {
			return res.status(403).json({
				error: 'Unauthorized',
			});
		}

		const result = await findUserRequests(id);

		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

usersController.getUserReports = async (req, res, next) => {
	const { id } = req.params;

	try {
		// autorizacion
		const user = await findUserById(req.user.id);

		if (!user || (user.role.name !== 'admin' && user.id !== parseInt(id))) {
			return res.status(403).json({
				error: 'Unauthorized',
			});
		}

		const result = await findUserReports(id);

		res.status(200).json(result);
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
		// autorizacion
		const reqUser = await findUserById(request.user.id);

		if (
			!reqUser ||
			(reqUser.role.name !== 'admin' && reqUser.id !== parseInt(id))
		) {
			return response.status(403).json({
				error: 'Unauthorized',
			});
		}

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
