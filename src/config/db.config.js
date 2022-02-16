const config = {
	dbName: process.env.DB_NAME,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	DBEngine: 'mysql',
};

module.exports = config;
