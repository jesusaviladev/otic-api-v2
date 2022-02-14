const reportsRouter = require('express').Router();

reportsRouter.get('/', (request, response) => {
	response.send('get report');
});

reportsRouter.get('/:id', (request, response) => {
	response.send('get report by id');
});

reportsRouter.post('/', (request, response) => {
	response.send('create report');
});

reportsRouter.put('/:id', (request, response) => {
	response.send('edit report');
});

reportsRouter.delete('/:id', (request, response) => {
	response.send('delete report');
});

module.exports = reportsRouter;
