const database = process.env.NODE_ENV === 'test' 
? process.env.DB_NAME_TEST 
: process.env.DB_NAME

const config = {
	dbName: database,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	DBEngine: 'mysql',
};

module.exports = config;
