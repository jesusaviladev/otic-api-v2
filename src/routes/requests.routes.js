const requestsRouter = require('express').Router();
const {
	getRequests,
	getRequestsById,
	createRequest,
	editRequest,
	deleteRequest,
} = require('../controllers/requests.controller.js');
const { validateRequest, validateEditedRequest } = require('../middlewares/validation.js')

requestsRouter.get('/', getRequests);

requestsRouter.get('/:id', getRequestsById);

requestsRouter.post('/', validateRequest, createRequest);

requestsRouter.patch('/:id', validateEditedRequest, editRequest);

requestsRouter.delete('/:id', deleteRequest);

module.exports = requestsRouter;
