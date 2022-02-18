const User = require('../models/users.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = {};

authController.signup = (request, response) => {
	response.send('signup');
};

authController.login = async (request, response, next) => {

	const { username, password } = request.body;

	try {
		const user = await User.findOne({ where: { username: username } });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return response.status(400).json({
				error: 'Username or password are invalid'
			});
		} else {

			const signedUser = {
				id: user.id,
				username: user.username,
				role: user.role_id
			}
			
			const token = jwt.sign(signedUser, process.env.SECRET)

			return response.status(200).json({
				signedUser,
				token
			});
		}
	} catch (error) {
		next(error);
	}
};

module.exports = authController;
