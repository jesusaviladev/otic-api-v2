const errorHandler = (error, request, response, next) => {
	if (
		error.name === 'JsonWebTokenError' ||
		error.name === 'TokenExpiredError'
	) {
		return response.status(401).json({
			error: 'Missing or invalid token',
		});
	}

	console.error(`System exception. ${error.name}: ${error.message}`);

	return response.status(500).json({
		error: 'Internal Server Error',
	});
};

module.exports = errorHandler;
