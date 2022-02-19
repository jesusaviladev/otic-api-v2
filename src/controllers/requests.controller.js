const {
	findRequests,
	findRequestById,
	addRequest,
	editRequest,
	deleteRequest,
} = require('../services/requests.services.js');

const requestsController = {};

requestsController.getRequests = async (request, response, next) => {
	try {
		const requests = await findRequests();

		return response.status(200).json({
			requests,
		});
	} catch (error) {
		next(error);
	}
};

requestsController.getRequestsById = async (req, res, next) => {
	const { id } = req.params;

	try {
		const request = await findRequestById(id);

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

requestsController.createRequest = async (request, response, next) => {
	const data = request.body;

	try {
		const request = await addRequest(data);

		return response.status(200).json({ request });
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

		return response.status(200).json(deletedRequest);
	} catch (error) {
		next(error);
	}
};

module.exports = requestsController;