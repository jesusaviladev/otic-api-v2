const requestsRouter = require('express').Router();
const {
	getRequests,
	getRequestsById,
	createRequest,
	editRequest,
	deleteRequest,
} = require('../controllers/requests.controller.js');
const {
	validateRequest,
	validateEditedRequest,
	validateParams,
} = require('../middlewares/validation.js');
const { verifyToken, checkAdmin } = require('../middlewares/auth.js');

requestsRouter.get(
	'/',
	verifyToken,
	checkAdmin,
	validateParams,
	getRequests
);

requestsRouter.get('/:id', verifyToken, getRequestsById);

requestsRouter.post('/', verifyToken, validateRequest, createRequest);

requestsRouter.patch(
	'/:id',
	verifyToken,
	checkAdmin,
	validateEditedRequest,
	editRequest
);

requestsRouter.delete('/:id', verifyToken, checkAdmin, deleteRequest);

module.exports = requestsRouter;
