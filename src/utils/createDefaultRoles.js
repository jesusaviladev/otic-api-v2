const rolesModel = require("../models/roles.model.js");

const createDefaultRoles = async () => {
	try {
		const result = await rolesModel.findAll();

		if (result.length === 0) {

			const values = await Promise.all([
				rolesModel.create({ role: "admin" }),
				rolesModel.create({ role: "user" }),
			]);

			for(const value of values){
				console.log("Successfully created default role", value.dataValues);
			}

		}

	} catch (error) {
			
		throw new Error(error);
	}
}

module.exports = createDefaultRoles;
