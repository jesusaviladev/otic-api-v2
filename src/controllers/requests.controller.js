const requestsController = {};
const {
	findRequests,
	findRequestById,
	addRequest,
	editRequest,
	deleteRequest,
	requestModelAttributes
} = require('../services/requests.services.js');
const { findUserById } = require('../services/users.services.js');

requestsController.getRequests = async (req, res, next) => {
	const { page = 1, limit = 10, sortBy = 'id', orderBy = 'asc' } = req.query;

	if(!requestModelAttributes.includes(sortBy)){
		return res.status(400).json({
			error: 'Invalid parameter in request'
		})
	}

	try {
		const requests = await findRequests({
			page: page, 
			limit: limit, 
			sort: sortBy, 
			order: orderBy
		});

		return res.status(200).json({
			requests: requests.rows,
			page: {
				currentPage: page,
				per_page: limit,
				total: requests.count,
				next: `http://localhost:3001/api/requests?page=${
					page + 1
				}&limit=${limit}`,
			},
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

		const createdRequest = await addRequest(data);

		const request = await findRequestById(createdRequest.request.id);

		return res.status(201).json({
			request: request,
			device: createdRequest.device || null,
		});
	} catch (error) {
		next(error);
	}
};

requestsController.editRequest = async (req, res, next) => {
	const { id } = req.params;

	const data = req.body;

	const request = await findRequestById(id);

	if (
		data.user_id &&
		parseInt(data.user_id) !== request.user_id &&
		request.status_id === 3
	) {
		return res.status(400).json({
			error: 'No puede cambiar el usuario de una solicitud completada.',
		});
	}

	if (data.user_id === null && request.status_id === 3) {
		return res.status(400).json({
			error: 'No puede cambiar el usuario de una solicitud completada.',
		});
	}

	try {
		const [editedRequest] = await editRequest(id, data);

		if (editedRequest === 0)
			return res.status(404).json({
				status: 'Request not found',
			});

		return res.status(200).json({
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
