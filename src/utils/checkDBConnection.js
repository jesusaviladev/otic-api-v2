const { db } = require('../services/connection.js');
const { createDefaultRoles, createDefaultStatus } = require('./defaultConfig.js');

const checkDBConnection = () => {
	db.authenticate()
		.then(async () => {
			console.log('Succesfully connected to Database');
			await db.sync();
			console.log('All tables synced');
			await createDefaultRoles();
			await createDefaultStatus();
			console.log('Database waiting for queries...')
		})
		.catch(async (error) => {
			console.log('Unable to connect to Database, exiting...')
			await db.close();
			throw new Error(error);
		});
};

module.exports = checkDBConnection
