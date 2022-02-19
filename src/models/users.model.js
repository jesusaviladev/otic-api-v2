const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');
const Role = require('./roles.model.js');

const User = db.define('users', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	surname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	ci: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: true,
	},
	telephone: {
		type: DataTypes.STRING(25),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isEmail: true,
		},
		unique: true,
	},
});

User.belongsTo(Role, {
	foreignKey: {
		name: 'role_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

module.exports = User;
