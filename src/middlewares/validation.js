const { check, validationResult, matchedData } = require('express-validator');
const { fieldExists } = require('../utils/fieldExists');
const Device = require('../models/device.model.js');
const Request = require('../models/requests.model.js');
const User = require('../models/users.model.js');

const validateUser = [
	check('username', 'Ingrese un nombre de usuario válido')
		.exists()
		.notEmpty()
		.isString()
		.isAlphanumeric()
		.trim()
		.escape()
		.custom(async (value) => {
			if (await fieldExists('username', value)) {
				return Promise.reject('Este nombre de usuario ya está registrado');
			}
		}),
	check('password', 'Ingrese una contraseña válida')
		.exists()
		.notEmpty()
		.isString()
		.isLength({ min: 6 })
		.trim(),
	check('name', 'Ingrese un nombre válido')
		.exists()
		.notEmpty()
		.isString()
		.isAlpha('es-ES', { ignore: 's' })
		.toLowerCase()
		.trim()
		.escape(),
	check('surname', 'Ingrese un apellido válido')
		.exists()
		.notEmpty()
		.isString()
		.isAlpha('es-ES', { ignore: 's' })
		.toLowerCase()
		.trim()
		.escape(),
	check('ci', 'Ingrese un documento válido')
		.exists()
		.notEmpty()
		.isString()
		.trim()
		.matches(/([V,E]-[0-9]{5,9})$/)
		.custom(async (value) => {
			if (await fieldExists('ci', value)) {
				return Promise.reject('Este documento de identidad ya está registrado');
			}
		}),
	check('telephone', 'Ingrese un número telefónico válido')
		.exists()
		.notEmpty()
		.isString()
		.trim(),
	check('email', 'Ingrese un correo electrónico válido')
		.exists()
		.notEmpty()
		.isEmail()
		.trim()
		.custom(async (value) => {
			if (await fieldExists('email', value)) {
				return Promise.reject('Este correo electrónico ya está registrado');
			}
		}),
	check('role', 'Ingrese el rol del usuario')
		.exists()
		.notEmpty()
		.isNumeric()
		.matches(/^[1-2]$/),

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
	check('username', 'Ingrese un nombre de usuario válido')
		.optional()
		.notEmpty()
		.isString()
		.isAlphanumeric()
		.trim()
		.escape()
		.custom(async (value, { req }) => {

			const { id } = req.params

			const editedUser = await User.findOne({ where: { id: id }})

			if (editedUser.username !== value && await fieldExists('username', value)) {
				return Promise.reject('Este usuario ya está registrado');
			}
		}),
	check('password', 'Debe ingresar una contraseña válida')
		.optional()
		.notEmpty()
		.isString()
		.isLength({ min: 6 })
		.trim(),
	check('name', 'Ingrese un nombre válido')
		.optional()
		.notEmpty()
		.isString()
		.isAlpha('es-ES', { ignore: 's' })
		.toLowerCase()
		.trim()
		.escape(),
	check('surname', 'Ingrese un apellido válido')
		.optional()
		.notEmpty()
		.isString()
		.isAlpha('es-ES', { ignore: 's' })
		.toLowerCase()
		.trim()
		.escape(),
	check('ci', 'Ingrese un número de cédula válido')
		.optional()
		.notEmpty()
		.isString()
		.trim()
		.matches(/([V,E]-[0-9]{5,9})$/)
		.custom(async (value, { req }) => {

			const { id } = req.params

			const editedUser = await User.findOne({ where: { id: id }})

			if (editedUser.ci !== value && await fieldExists('ci', value)) {
				return Promise.reject('Este documento de identidad ya está registrado');
			}
		}),
	check('telephone', 'Ingrese un número de teléfono válido')
		.optional()
		.notEmpty()
		.isString()
		.trim(),
	check('email', 'Ingrese un correo electrónico válido')
		.optional()
		.notEmpty()
		.isEmail()
		.trim()
		.custom(async (value, { req }) => {

			const { id } = req.params

			const editedUser = await User.findOne({ where: { id: id }})

			if (editedUser.email !== value && await fieldExists('email', value)) {
				return Promise.reject('Este correo electrónico ya ha sido registrado');
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

const validateParams = [
	check('since_id', 'Invalid parameter in request')
		.optional()
		.isNumeric()
		.trim()
		.toInt(),
	check('page', 'Invalid parameter in request')
		.optional()
		.isNumeric()
		.trim()
		.toInt(),
	check('limit', 'Invalid parameter in request')
		.optional()
		.isNumeric()
		.trim()
		.matches(/^([1-9][0-9]?|100)$/)
		.toInt(),
	check('sortBy', 'Invalid parameter in request')
		.optional()
		.isString()
		.toLowerCase()
		.trim(),
	check('orderBy', 'Invalid parameter in request')
		.optional()
		.isString()
		.isAlpha()
		.toLowerCase()
		.trim()
		.isIn(['asc', 'desc']),
	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const matched = matchedData(request);
		request.query = matched;

		next();
	},
];

const validateLogin = [
	check('username').exists().notEmpty().isString().isAlphanumeric().trim(),
	check('password').exists().notEmpty().isString().trim(),
	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({
				error: 'Ingrese un usuario y contraseña válidos',
			});
		}

		const matched = matchedData(request);
		request.body = matched;

		next();
	},
];

const validateRequest = [
	check('description', 'Must be a valid string')
		.exists()
		.notEmpty()
		.isString()
		.trim()
		.escape(),
	check('user_id', 'Must be a valid id')
		.optional()
		.if((value) => value !== null)
		.notEmpty()
		.trim()
		.custom(async (value) => {
			if (!(await fieldExists('id', value))) {
				return Promise.reject('Invalid ID, user does not exists');
			}
		}),
	check('device', 'Must be an object').exists().isObject(),
	check('device.exists', 'Must be a boolean value')
		.exists()
		.notEmpty()
		.isBoolean({ loose: false })
		.custom(async (value, { req }) => {
			if (value === true) {
				const device = await Device.findOne({
					where: { serial: req.body.device.serial },
				});

				if (!device) {
					return Promise.reject('Invalid ID, device does not exists');
				}
			} else {
				const device = await Device.findOne({
					where: { serial: req.body.device.serial },
				});

				if (device) {
					return Promise.reject('Device already exists');
				}
			}
		}),
	check('device.serial', 'Must be a valid serial id')
		.exists()
		.notEmpty()
		.isString()
		.trim(),
	check('device.type', 'Must be a valid string')
		.if((value, { req }) => req.body.device.exists === false)
		.exists()
		.notEmpty()
		.isString()
		.trim(),
	check('device.name', 'Must be a valid string')
		.if((value, { req }) => req.body.device.exists === false)
		.exists()
		.notEmpty()
		.isString()
		.trim(),
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

const validateEditedRequest = [
	check('description').optional().notEmpty().isString().trim().escape(),
	check('user_id', 'Must be a valid id')
		.optional()
		.if((value) => value !== null)
		.trim()
		.custom(async (value) => {
			if (!(await fieldExists('id', value))) {
				return Promise.reject('Invalid ID, user does not exists');
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

const validateReport = [
	check('comment').exists().notEmpty().isString().trim().escape(),
	check('request_id')
		.exists()
		.notEmpty()
		.trim()
		.custom(async (value) => {
			const request = await Request.findOne({ where: { id: value } });

			if (!request) {
				return Promise.reject('Invalid ID, request does not exists');
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

const validateEditedReport = [
	check('comment').optional().notEmpty().isString().trim().escape(),
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

const validateEditedDevice = [
	check('serial', 'Must be a valid serial id')
		.optional()
		.notEmpty()
		.isString()
		.trim(),
	check('type', 'Must be a valid string')
		.optional()
		.notEmpty()
		.isString()
		.trim(),
	check('name', 'Must be a valid string')
		.optional()
		.notEmpty()
		.isString()
		.trim(),
	(request, response, next) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({ errors: errors.array() });
		}

		const matched = matchedData(request, { locations: ['body'] });

		request.body = matched;

		next();
	},
];

module.exports = {
	validateUser,
	validateEditedUser,
	validateParams,
	validateLogin,
	validateRequest,
	validateEditedRequest,
	validateReport,
	validateEditedReport,
	validateEditedDevice,
};
