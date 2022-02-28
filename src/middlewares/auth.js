const jwt = require('jsonwebtoken');

const verifyToken = (request, response, next) => {
	try {
		const authorization = request.get('authorization');

		let token = null;

		if (authorization && authorization.toLowerCase().startsWith('bearer')) {
			token = authorization.substring(7);
		}

		if (!token) {
			return response.status(401).json({
				error: 'Missing or invalid token',
			});
		}

		const decodedToken = jwt.verify(token, process.env.SECRET);

		//autorizacion

		if (decodedToken.role === 2) {
			let reqUrl = request.baseUrl + request.route.path;

			if (
				reqUrl.includes('/api/users/:id') &&
				parseInt(request.params.id) !== decodedToken.id
			) {
				return response.status(403).json({
					error: 'Unauthorized',
				});
			}
		}

		request.user = decodedToken;

		next();
	} catch (error) {
		next(error);
	}
};

const checkAdmin = (request, response, next) => {
	if (request.user.role !== 1) {
		return response.status(403).json({
			error: 'Unauthorized',
		});
	}

	next();
};

module.exports = {
	verifyToken,
	checkAdmin,
};
