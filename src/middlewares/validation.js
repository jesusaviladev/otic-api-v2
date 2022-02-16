const { check, validationResult, matchedData } = require('express-validator');
const { fieldExists } = require('../utils/fieldExists');

const validateUser = [
	check('username', 'Must enter a valid username')
		.exists()
		.notEmpty()
		.isString()
		.isAlphanumeric()
		.trim()
		.escape()
		.custom(async (value) => {
			if (await fieldExists('username', value)) {
				return Promise.reject('Username already registered');
			}
		}),
	check('password', 'Must enter a valid password')
		.exists()
		.notEmpty()
		.isString()
		.isLength({ min: 6 })
		.trim(),
	check('name', 'Must enter a valid name')
		.exists()
		.notEmpty()
		.isString()
		.toLowerCase()
		.trim()
		.escape(),
	check('surname', 'Must enter a valid name')
		.exists()
		.notEmpty()
		.isString()
		.toLowerCase()
		.trim()
		.escape(),
	check('ci', 'Must enter a valid document')
		.exists()
		.notEmpty()
		.isString()
		.trim()
		.custom(async (value) => {
			if (await fieldExists('ci', value)) {
				return Promise.reject('Document already exists');
			}
		}),
	check('telephone', 'Must enter a valid telephone number')
		.exists()
		.notEmpty()
		.isString()
		.trim(),
	check('email', 'Must enter a valid email')
		.exists()
		.notEmpty()
		.isEmail()
		.trim()
		.custom(async (value) => {
			if (await fieldExists('email', value)) {
				return Promise.reject('Email already exists');
			}
		}),
	check('role', 'Must enter an user role').exists().notEmpty(),

	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const matched = matchedData(request);

		request.body = matched;

		next();
	},
];

const validateEditedUser = [
	check('username', 'Must enter a valid username')
		.optional()
		.notEmpty()
		.isString()
		.isAlphanumeric()
		.trim()
		.escape()
		.custom(async (value) => {
			if (await fieldExists('username', value)) {
				return Promise.reject('Username already registered');
			}
		}),
	check('password', 'Must enter a valid password')
		.optional()
		.notEmpty()
		.isString()
		.isLength({ min: 6 })
		.trim(),
	check('name', 'Must enter a valid name')
		.optional()
		.notEmpty()
		.isString()
		.toLowerCase()
		.trim()
		.escape(),
	check('surname', 'Must enter a valid name')
		.optional()
		.notEmpty()
		.isString()
		.toLowerCase()
		.trim()
		.escape(),
	check('ci', 'Must enter a valid document')
		.optional()
		.notEmpty()
		.isString()
		.trim()
		.custom(async (value) => {
			if (await fieldExists('ci', value)) {
				return Promise.reject('Document already exists');
			}
		}),
	check('telephone', 'Must enter a valid telephone number')
		.optional()
		.notEmpty()
		.isString()
		.trim(),
	check('email', 'Must enter a valid email')
		.optional()
		.notEmpty()
		.isEmail()
		.trim()
		.custom(async (value) => {
			if (await fieldExists('email', value)) {
				return Promise.reject('Email already exists');
			}
		}),

	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const matched = matchedData(request);
		request.body = matched;

		next();
	},
];

const validatePagination = [
	check('since_id', 'Invalid parameter in request')
		.optional().isNumeric().trim(),
	check('limit', 'Invalid parameter in request')
		.optional().isNumeric().trim().matches(/^([1-9][0-9]?|100)$/),
	(request, response, next) => {

		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const matched = matchedData(request);
		request.query = matched;
		
		next();
	}
]

module.exports = {
	validateUser,
	validateEditedUser,
	validatePagination
};
