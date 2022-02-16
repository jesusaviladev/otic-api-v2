//requerimos modulos de node
const express = require('express');
require('dotenv').config();
require('./services/connection.js'); //Nos conectamos a la BD
const checkDBConnection = require('./utils/checkDBConnection.js');
const pkg = require('../package.json');

//Verificamos conexion a la BD
checkDBConnection();

//importamos rutas
const authRouter = require('./routes/authentication.routes.js');
const usersRouter = require('./routes/users.routes.js');
const requestsRouter = require('./routes/requests.routes.js');
const reportsRouter = require('./routes/reports.routes.js');

//importamos middlewares
const notFound = require('./middlewares/notFound.js');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

//configuración
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//rutas
app.get('/', (request, response) => {
	return response.status(200).json({
		app: pkg.name,
		version: pkg.version,
		author: pkg.author,
		description: pkg.description,
		message: 'API working correctly',
	});
});

app.use('/api/auth', authRouter);

app.use('/api/users', usersRouter);

app.use('/api/requests', requestsRouter);

app.use('/api/reports', reportsRouter);

//ruta no encontrada
app.use(notFound);

//manejador de errores
app.use(errorHandler);

//iniciar el servidor

const port = app.get('port');

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = {
	app,
};
