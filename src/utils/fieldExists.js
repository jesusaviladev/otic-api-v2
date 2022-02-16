const userModel = require('../models/users.model.js');

const fieldExists = async (field, value) => {
	const result = await userModel.count({
		where: {
			[field]: value,
		},
	});

	return result > 0;
};

module.exports = {
	fieldExists,
};
