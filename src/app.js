//requerimos modulos de node
require('dotenv').config()
const express = require("express");
const pkg = require("../package.json");

//importamos rutas
const authRouter = require("./routes/authentication.routes.js");
const usersRouter = require("./routes/users.routes.js");
const requestsRouter = require("./routes/requests.routes.js");
const reportsRouter = require("./routes/reports.routes.js");

const app = express();

//configuración
app.set("port", process.env.PORT || 3000);

//middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//rutas
app.get("/", (request, response) => {
	response.json({
		app: pkg.name,
		version: pkg.version,
		author: pkg.author,
		description: pkg.description,
		message: "API working correctly",
	});
});

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/requests", requestsRouter);

app.use("/api/reports", reportsRouter);

//ruta no encontrada
app.use((request, response, next) => {
	response.status(404).json({
		error: "404 not found",
	});
});

//manejador de errores
app.use((error, req, res, next) => {
	console.log(error);

	response.status(500).json({
		error: "Internal server error",
	});
});

//iniciar el servidor

const port = app.get("port");

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = {
	app,
};
