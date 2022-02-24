const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');
const User = require('./users.model.js');
const Request = require('./requests.model.js');

const options = { createdAt: false };

const Report = db.define('reports', {
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
}, options);

Report.belongsTo(User, {
	foreignKey: {
		name: 'user_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Report.belongsTo(Request, {
	foreignKey: {
		name: 'request_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

module.exports = Report;
