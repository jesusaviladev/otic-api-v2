const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const User = require('../src/models/users.model');
const { usuarios } = require('./utils/usuarios.js');
const supertest = require('supertest');

const api = supertest(app);

beforeAll(async () => {
	await checkDBConnection();
	await User.bulkCreate(usuarios);
});

describe('usuarios', () => {
	test('debe tener al menos 3 usuarios', async () => {
		const response = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-type', /application\/json/);

		expect(response.body.users).toHaveLength(3);
	});

	test('debe recuperar la información de un usuario', async () => {
		const response = await api
			.get('/api/users/1')
			.expect(200)
			.expect('Content-type', /application\/json/);

		expect(response.body.user.id).toBe(1);
		expect(response.body.user.name).toBe('jesus');
	});

	test('debe poder crear un usuario', async () => {
		const response = await api
			.post('/api/users')
			.send({
				username: 'chamba',
				password: 'pepito',
				name: 'Chamba',
				surname: 'UPT',
				ci: '26778125',
				telephone: '04121588783',
				email: 'avijesus14@gmail.com',
				role: '2',
			})
			.expect(201)
			.expect('Content-type', /application\/json/);

		expect(response.body.id).toBe(4)

		const users = await User.findAll()

		expect(users).toHaveLength(4)

	});

	test('no debe permitir un usuario con campos unicos repetidos', async () => {
		const response = await api
		.post('/api/users')
		.send({
				username: 'chamba',
				password: 'pepito',
				name: 'Chamba',
				surname: 'UPT',
				ci: '26778125',
				telephone: '04121588783',
				email: 'avijesus14@gmail.com',
				role: '2',
			})
		.expect(400)

		const users = await User.findAll()

		expect(users).toHaveLength(4)
	})

	test('no debe permitir datos invalidos', async () => {
		const response = await api
		.post('/api/users')
		.send({
				username: 445465,
				password: 'asdasdas',
				name: 'Chamba',
				surname: 'UPT',
				ci: 1112,
				telephone: '04121588783',
				email: 'jesus.com',
				role: '2',
			})
		.expect(400)

		const users = await User.findAll()

		expect(users).toHaveLength(4)
	})

	test('debe poder editar un usuario correctamente', async () => {
		const response = await api
		.patch('/api/users/4')
		.send({
			username: 'elchambas',
			password: 'blah456', //la contraseña debe ser mayor a 6 caracteres
			ci: '26778126',
			name: 'pepito',
			surname: 'UPT 2',
			role: 1
		})
		.expect(200)

		const editedUser = await User.findOne({ where : { id: 4 }})

		expect(editedUser.username).toBe('elchambas')
		expect(editedUser.name).toBe('pepito')
		expect(editedUser.surname).toBe('upt 2') //devuelve lowercase
		expect(editedUser.role_id).toBe(2) //no se debe poder asignar un rol
		expect(editedUser.ci).toBe('26778126')
	})

	test('no debe permitir editar un campo con datos repetidos', async () => {
		const response = await api
		.patch('/api/users/4')
		.send({
			username: 'jesusaviladev' //nombre repetido
		})
		.expect(400)

		const editedUser = await User.findOne({ where : { id: 4 }})
		expect(editedUser.username).toBe('elchambas')
	})

	test('debe poder eliminar un usuario', async () => {
		const response = await api
		.delete('/api/users/4')
		.expect(200)

		const users = await User.findAll()

		expect(users).toHaveLength(3)
	})
});

afterAll(async () => {
	await db.drop();
});
