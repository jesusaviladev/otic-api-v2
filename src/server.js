const { app, checkDBConnection } = require('./app.js');
// iniciar el servidor

const port = app.get('port');

const server = app.listen(port, async () => {
	// Verificamos conexion a la BD
	await checkDBConnection();
	console.log(`Server listening on port ${port}`);
});

module.exports = server;
