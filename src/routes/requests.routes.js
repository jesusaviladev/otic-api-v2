const requestsRouter = require('express').Router();
const {
	getRequests,
	getRequestsById,
	createRequest,
	editRequest,
	deleteRequest,
} = require('../controllers/requests.controller.js');
const { validateRequest, validateEditedRequest } = require('../middlewares/validation.js')
const { verifyToken, checkAdmin } = require('../middlewares/auth.js')

requestsRouter.get('/', verifyToken, checkAdmin, getRequests);

requestsRouter.get('/:id', verifyToken, checkAdmin, getRequestsById);

requestsRouter.post('/', verifyToken, checkAdmin, validateRequest, createRequest);

requestsRouter.patch('/:id', verifyToken, checkAdmin, validateEditedRequest, editRequest);

requestsRouter.delete('/:id', verifyToken, checkAdmin, deleteRequest);

module.exports = requestsRouter;
