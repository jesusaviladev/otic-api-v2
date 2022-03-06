const jwt = require('jsonwebtoken');
const { findUserById } = require('../services/users.services.js')

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

		request.user = decodedToken;

		next();

	} catch (error) {
		next(error);
	}
};

const checkAdmin = async (request, response, next) => {
	try {

		const user = await findUserById(request.user.id)

		if(!user || user.role.name !== 'admin'){
			return response.status(403).json({
				error: 'Unauthorized'
			})
		}

		next()
	}

	catch(error){
		next(error)
	}
}

module.exports = {
	verifyToken,
	checkAdmin
};
