const requestsController = {};
const getPagination = require('../utils/getPagination.js');
const {
	findRequests,
	findRequestById,
	addRequest,
	editRequest,
	deleteRequest,
} = require('../services/requests.services.js');
const { findUserById } = require('../services/users.services.js');

requestsController.getRequests = async (request, response, next) => {
	const { since_id = 0, limit = 10 } = request.query;

	try {
		const requests = await findRequests(since_id, limit);

		const { data, pagination } = getPagination(requests, limit, request);

		return response.status(200).json({
			requests: data,
			pagination,
		});
	} catch (error) {
		next(error);
	}
};

requestsController.getRequestsById = async (req, res, next) => {
	const { id } = req.params;

	try {
		const user = await findUserById(req.user.id);

		const request = await findRequestById(id);

		if (!user || (user.role.name !== 'admin' && request.user_id !== user.id)) {
			return res.status(403).json({
				error: 'User not allowed to see this request',
			});
		}

		if (!request)
			return res.status(404).json({
				status: 'Request not found',
			});

		return res.status(200).json({
			request,
		});
	} catch (error) {
		next(error);
	}
};

requestsController.createRequest = async (req, res, next) => {
	const data = req.body;

	try {
		const user = await findUserById(req.user.id);

		if (user.role.name !== 'admin') {
			data.user_id = null;
		}

		const request = await addRequest(data);

		return res.status(200).json({
			request,
		});
	} catch (error) {
		next(error);
	}
};

requestsController.editRequest = async (request, response, next) => {
	const { id } = request.params;

	const data = request.body;

	try {
		const [editedRequest] = await editRequest(id, data);

		if (editedRequest === 0)
			return response.status(404).json({
				status: 'Request not found',
			});

		return response.status(200).json({
			message: 'Successfully edited request',
		});
	} catch (error) {
		next(error);
	}
};

requestsController.deleteRequest = async (request, response, next) => {
	const { id } = request.params;

	try {
		const deletedRequest = await deleteRequest(id);

		if (!deletedRequest) {
			return response.status(404).json({
				status: 'No request found',
			});
		}

		return response.status(200).json({
			message: 'Successfully deleted request',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = requestsController;
