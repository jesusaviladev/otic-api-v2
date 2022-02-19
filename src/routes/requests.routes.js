const requestsRouter = require('express').Router();
const {
	getRequests,
	getRequestsById,
	createRequest,
	editRequest,
	deleteRequest,
} = require('../controllers/requests.controller.js');

requestsRouter.get('/', getRequests);

requestsRouter.get('/:id', getRequestsById);

requestsRouter.post('/', createRequest);

requestsRouter.patch('/:id', editRequest);

requestsRouter.delete('/:id', deleteRequest);

module.exports = requestsRouter;
