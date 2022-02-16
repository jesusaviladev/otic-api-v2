const errorHandler = (error, request, response, next) => {

	console.error(`System exception. ${error.name}: ${error.message}`);

	return response.status(500).json({
		error: 'Internal Server Error',
	});
};

module.exports = errorHandler;
