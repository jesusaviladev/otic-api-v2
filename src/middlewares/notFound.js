const notFound = (request, response, next) => {
	return response.status(404).json({
		error: '404 not found',
	});
};

module.exports = notFound;
