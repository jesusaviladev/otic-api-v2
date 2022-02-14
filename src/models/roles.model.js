const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { timestamps: false };

const rolesModel = db.define(
	'roles',
	{
		role: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	options
);

module.exports = rolesModel;
