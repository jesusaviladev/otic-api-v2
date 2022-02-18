const User = require('../models/users.model.js');

const fieldExists = async (field, value) => {
	const result = await User.count({
		where: {
			[field]: value,
		},
	});

	return result > 0;
};

module.exports = {
	fieldExists,
};
