// requerimos modulos de node
const express = require('express');
require('dotenv').config();
require('./services/connection.js'); // Nos conectamos a la BD
require('./models/associations');
const checkDBConnection = require('./utils/checkDBConnection.js');
const pkg = require('../package.json');
const cors = require('cors');

// importamos rutas
const authRouter = require('./routes/authentication.routes.js');
const usersRouter = require('./routes/users.routes.js');
const requestsRouter = require('./routes/requests.routes.js');
const reportsRouter = require('./routes/reports.routes.js');

// importamos middlewares
const notFound = require('./middlewares/notFound.js');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// configuración
app.set('port', process.env.PORT || 3001);

// middlewares
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors());

// rutas
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

// ruta no encontrada
app.use(notFound);

// manejador de errores
app.use(errorHandler);

module.exports = {
	// exportamos para testing
	app,
	checkDBConnection,
};
