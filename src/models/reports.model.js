const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');
const User = require('./users.model.js');
const Request = require('./requests.model.js');

const Report = db.define('reports',
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		date: {
			allowNull: false,
			type: DataTypes.DATE
		},
		comment: {
			allowNull: false,
			type: DataTypes.TEXT
		}
	})

Report.belongsTo(User, {
	foreignKey: 'user_id',
	allowNull: false,
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT'
})

Report.belongsTo(Request, {
	foreignKey: 'request_id',
	allowNull: false,
	onDelete: 'RESTRICT',
	onUpdate: 'RESTRICT'
})

module.exports = Report;