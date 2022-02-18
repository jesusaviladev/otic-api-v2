const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');
const User = require('./users.model.js');
const Status = require('./status.model.js');

const options = { timestamps: false };

const Request = db.define('requests', {
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
});

Request.belongsTo(User, {
	foreignKey: {
		name: 'user_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Request.belongsTo(Status, {
	foreignKey: {
		name: 'status_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

module.exports = Request;
