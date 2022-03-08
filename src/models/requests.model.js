const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { createdAt: false };

const Request = db.define(
	'requests',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		date: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		description: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
	},
	options
);

module.exports = Request;
