const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { timestamps: false };

const Role = db.define(
	'roles',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		name: {
			type: DataTypes.STRING(10),
			allowNull: false,
			unique: true,
		},
	},
	options
);

module.exports = Role;
