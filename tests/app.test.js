const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const Role = require('../src/models/roles.model');
const Status = require('../src/models/status.model');
const User = require('../src/models/users.model');
const { usuarios } = require('./utils/usuarios.js');
const supertest = require('supertest');

const api = supertest(app);

beforeAll(async () => {
	await checkDBConnection();
	await User.bulkCreate(usuarios)
});

describe('api', () => {
	test('inicia correctamente', async () => {
		await api
			.get('/')
			.expect(200)
			.expect('Content-type', /application\/json/);
	});

	test('carga la configuracion por defecto en la BD', async () => {
		const tables = await db.showAllSchemas();

		expect(tables.length).toBe(6);
	});

	test('debe tener 2 roles por defecto', async () => {
		const roles = await Role.findAll({});

		expect(roles.length).toBe(2);
	});

	test('debe tener 3 estados en la tabla de estados', async () => {
		const status = await Status.findAll({});

		expect(status.length).toBe(3);
	});
});

describe('post /api/auth', () => {
	test('debe iniciar sesion y devolver un token', async () => {

		const response = await api
			.post('/api/auth/login')
			.send({
				username: 'jesusaviladev',
				password: 'pepito'
			})
			.expect(200);

		expect(response.body.token).toBeDefined();
	});

	test('debe dar error si el usuario o contraseña son incorrectos', async () => {
		const response = await api
			.post('/api/auth/login')
			.send({
				username: 'jesusaviladev',
				password: 'pepito2',
			})
			.expect(400);
	});
});

afterAll(async () => {
	await db.drop();
});
