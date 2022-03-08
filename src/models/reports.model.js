const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { createdAt: false };

const Report = db.define(
	'reports',
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
		comment: {
			allowNull: false,
			type: DataTypes.TEXT,
		},
	},
	options
);

module.exports = Report;
