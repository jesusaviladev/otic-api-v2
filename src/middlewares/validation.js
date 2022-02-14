const { check, validationResult } = require('express-validator');

const validateCreate = [
	check('username', 'Must enter a valid username')
	.exists().not().isEmpty().isAlphanumeric().trim().escape(),
	check('password', 'Must enter a valid password')
	.exists().not().isEmpty().isLength({ min: 6 }).trim(),
	check('name', 'Must enter a valid name')
	.exists().not().isEmpty().toLowerCase().trim().escape(),
	check('surname', 'Must enter a valid name')
	.exists().not().isEmpty().toLowerCase().trim().escape(),
	check('ci', 'Must enter a valid document')
	.exists().not().isEmpty().trim(),
	check('telephone', 'Must enter a valid telephone number')
	.exists().not().isEmpty().trim(),
	check('email', 'Must enter a valid email')
	.exists().not().isEmpty().isEmail().trim(),
	check('role', 'Must enter an user role')
	.exists().not().isEmpty(),
	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}
		next()
	},
];

module.exports = {
	validateCreate
}
