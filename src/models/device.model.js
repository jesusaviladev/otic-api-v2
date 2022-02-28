const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const Device = db.define('devices', {
	serial: {
		allowNull: false,
		primaryKey: true,
		type: DataTypes.STRING(100),
		unique: true,
	},
	type: {
		type: DataTypes.STRING(50),
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
});

module.exports = Device;
