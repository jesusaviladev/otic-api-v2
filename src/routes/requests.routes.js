const requestsRouter = require('express').Router();

requestsRouter.get('/', (request, response) => {
	response.send('get request');
});

requestsRouter.get('/:id', (request, response) => {
	response.send('get request by id');
});

requestsRouter.post('/', (request, response) => {
	response.send('create request');
});

requestsRouter.put('/:id', (request, response) => {
	response.send('edit request');
});

requestsRouter.delete('/:id', (request, response) => {
	response.send('delete request');
});

module.exports = requestsRouter;
