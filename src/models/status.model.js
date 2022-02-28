const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const options = { timestamps: false };

const Status = db.define(
	'status',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		description: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
		},
	},
	options
);

module.exports = Status;
