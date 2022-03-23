const Role = require('../models/roles.model.js');
const Status = require('../models/status.model.js');
const User = require('../models/users.model.js');
const { hashPassword } = require('./hashPassword.js');

const createDefaultRoles = async () => {
	try {
		const result = await Role.count();

		if (result === 0) {
			const roles = await Role.bulkCreate([
				{ name: 'admin' },
				{ name: 'user' },
			]);

			for (const role of roles) {
				console.log('Successfully created default roles', role.dataValues);
			}
		}
	} catch (error) {
		throw new Error(error);
	}
};

const createDefaultStatus = async () => {
	try {
		const result = await Status.count();

		if (result === 0) {
			const status = await Status.bulkCreate([
				{ description: 'sin asignar' },
				{ description: 'pendiente' },
				{ description: 'completada' },
			]);

			for (const state of status) {
				console.log('Successfully created default status', state.dataValues);
			}
		}
	} catch (error) {
		throw new Error(error);
	}
};

const createAdmin = async () => {
	try {
		const result = await User.count();

		if (result === 0) {
			const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

			const admin = await User.create({
				username: 'admin',
				password: hashedPassword,
				name: 'admin',
				surname: 'admin',
				ci: 'V-000000',
				telephone: '0000000',
				email: 'admin@gmail.com',
				role_id: 1,
			});

			console.log('Admin user created', admin.toJSON());
		}
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	createDefaultRoles,
	createDefaultStatus,
	createAdmin,
};
