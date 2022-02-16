const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { timestamps: false };

const rolesModel = db.define(
	'roles',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		role: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	options
);

module.exports = rolesModel;
