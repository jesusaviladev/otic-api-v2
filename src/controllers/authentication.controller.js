const User = require('../models/users.model.js');
const jwt = require('jsonwebtoken');
const { checkPassword } = require('../utils/hashPassword.js')
const authController = {};

authController.login = async (request, response, next) => {
	const { username, password } = request.body;

	try {
		const user = await User.findOne({ where: { username: username } });

		const passwordMatch = user === null
				? false
				: await checkPassword(password, user.password);

		if (!user || !passwordMatch) {
			return response.status(400).json({
				error: 'Username or password are invalid',
			});
		} else {
			const signedUser = {
				id: user.id
			};

			const token = jwt.sign(signedUser, process.env.SECRET, {
				expiresIn: '3d'
			});

			return response.status(200).json({
				user: signedUser,
				token,
			});
		}
		
	} catch (error) {
		next(error);
	}
};

module.exports = authController;
