const errorHandler = (error, request, response, next) => {

	if(error.name === 'ValidationError'){

		const details = error.details.map((err) => err.message);

		return response.status(400).json({
			error: 'Bad request, invalid data',
			details: details
		})
	}

	console.error(`System exception. ${error.name}: ${error.message}`);

	return response.status(500).json({
		error: 'Internal Server Error',
	});
};

module.exports = errorHandler;
