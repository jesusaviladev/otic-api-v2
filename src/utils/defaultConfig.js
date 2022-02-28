const Role = require('../models/roles.model.js');
const Status = require('../models/status.model.js');

const createDefaultRoles = async () => {
	try {
		const result = await Role.count();

		if (result === 0) {

			const roles = await Role.bulkCreate([
				{ role: 'admin' },
				{ role: 'user' },
			]);

			for(const role of roles){
				console.log('Successfully created default roles', role.dataValues)
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
				{ description: 'completada' }
			]);

			for(const state of status){
				console.log('Successfully created default status', state.dataValues)
			}
		}
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = {
	createDefaultRoles,
	createDefaultStatus
};
