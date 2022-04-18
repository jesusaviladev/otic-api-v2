const User = require('../models/users.model.js');
const Request = require('../models/requests.model.js');
const Report = require('../models/reports.model.js');
const Role = require('../models/roles.model.js');
const { Op } = require('sequelize');
const { hashPassword } = require('../utils/hashPassword');

const findUsers = async (page, limit) => {
	const users = await User.findAndCountAll({
		offset: (page - 1) * limit,
		limit: limit,
		attributes: { exclude: ['password'] },
		include: {
			model: Role,
			attributes: ['name'],
		},
	});

	return users;
};

const findUserById = async (id) => {
	const user = await User.findOne({
		where: { id: id },
		attributes: { exclude: ['password'] },
		include: Role,
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

const findUserRequests = async (id) => {
	const result = await User.findOne({
		where: { id: id },
		include: Request,
		attributes: { exclude: ['password'] },
	});

	return result;
};

const findUserReports = async (id) => {
	const result = await User.findOne({
		where: { id: id },
		include: Report,
		attributes: { exclude: ['password'] },
	});

	return result;
};

module.exports = {
	findUsers,
	findUserById,
	addUser,
	editUser,
	deleteUser,
	findUserRequests,
	findUserReports,
};
