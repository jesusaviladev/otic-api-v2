const { Sequelize } = require('sequelize');
const {
	dbName,
	dbUser,
	dbPassword,
	host,
	DBEngine,
	options,
} = require('../config/db.config.js');

const db = new Sequelize(dbName, dbUser, dbPassword, {
	host: host,
	dialect: DBEngine,
	dialectOptions: options,
	logging: false, // activar o desactivar logging por consula de cada query
});

process.on('beforeExit', async (code) => {
	// Can make asynchronous calls
	await db.close();
	setTimeout(() => {
		console.log(`Process will exit with code: ${code}`);
		process.exit(code);
	}, 100);
});

process.on('uncaughtException', (err) => {
	console.log(err);
	console.error(`Uncaught Exception: ${err.message}`);
	process.exit(1);
});

module.exports = {
	db,
};
