const User = require('../models/users.model.js');
const { Op } = require('sequelize');
const hashPassword = require('../utils/hashPassword');

const findUsers = async (cursor, queryLimit) => {
	const users = await User.findAll({
		where: {
			id: {
				[Op.gt]: cursor,
			},
		},
		limit: queryLimit,
		attributes: { exclude: ['password'] },
	});

	return users;
};

const findUserById = async (id) => {
	const user = await User.findOne({
		where: { id: id },
		attributes: { exclude: ['password'] },
	});

	return user;
};

const addUser = async (userData) => {
	const { username, password, name, surname, ci, telephone, email, role } =
		userData;

	const hashedPassword = await hashPassword(password);

	const newUser = User.build({
		username,
		password: hashedPassword,
		name,
		surname,
		ci,
		telephone,
		email,
		role_id: role,
	});

	const savedUser = await newUser.save();

	return savedUser;
};

const editUser = async (id, data) => {
	const { password } = data;

	if (password) {
		const hashedPassword = await hashPassword(password);
		data.password = hashedPassword;
	}

	const editedUser = await User.update(data, {
		where: { id: id },
	});

	return editedUser;
};

const deleteUser = async (id) => {
	const user = await User.destroy({ where: { id: id } });

	return Boolean(user);
};

module.exports = {
	findUsers,
	findUserById,
	addUser,
	editUser,
	deleteUser,
};
