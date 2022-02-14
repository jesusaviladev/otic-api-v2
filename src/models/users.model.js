const { DataTypes } = require('sequelize');
const { db } = require('../services/connection.js');

const userModel = db.define('users', {
	username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	surname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	ci: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	telephone: {
		type: DataTypes.STRING(25),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
          isEmail: true
        }
	},
	role: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = userModel;
