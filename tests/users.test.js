const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const User = require('../src/models/users.model');
const { usuarios } = require('./utils/usuarios.js');
const supertest = require('supertest');

const api = supertest(app);

let adminToken = '';
let userToken = '';

beforeAll(async () => {
	await checkDBConnection();
	await User.bulkCreate(usuarios);
	const responseAdmin = await api.post('/api/auth/login').send({
		username: 'jesusaviladev',
		password: 'pepito'
	})

	const responseUser = await api.post('/api/auth/login').send({
		username: 'manueljerez',
		password: 'pepito'
	})

	adminToken = responseAdmin.body.token
	userToken = responseUser.body.token
});

describe('endpoints de usuarios', () => {

	describe('get /users', () => {

		test('debe responder con 3 usuarios', async () => {
			const response = await api
				.get('/api/users')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.users).toHaveLength(3);
		});

		test('debe responder con paginacion', async () => {
			const response = await api
				.get('/api/users?limit=2')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.users).toHaveLength(2)
			expect(response.body.pagination).toBeDefined()
			expect(response.body.pagination.next).toBeDefined()	
		})

		test('no debe devolver nada si no se envia un token', async () => {
			const response = await api
				.get('/api/users')
				.expect(401)
				.expect('Content-type', /application\/json/);	
		})

		test('no debe responder si el usuario no es admin', async () => {
			const response = await api
				.get('/api/users')
				.set('Authorization', `Bearer ${userToken}`)
				.expect(403)
				.expect('Content-type', /application\/json/);
		})

	})

	describe('get /users/:id', () => {

		test('debe recuperar la información de un usuario', async () => {
			const response = await api
				.get('/api/users/1')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.user.id).toBe(1);
			expect(response.body.user.name).toBe('jesus');
		});

		test('no debe devolver nada si no se envia un token', async () => {
			const response = await api
				.get('/api/users/2')
				.expect(401)
				.expect('Content-type', /application\/json/);	
		})

		test('debe devolver los datos del usuario', async () => {
			const response = await api
			.get('/api/users/2')
			.set('Authorization', `Bearer ${userToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.user.id).toBe(2);
			expect(response.body.user.name).toBe('manuel');
		})

		test('no debe responder si el id del usuario no es el consultado', async () => {
			const response = await api
			.get('/api/users/3')
			.set('Authorization', `Bearer ${userToken}`)
				.expect(403)
				.expect('Content-type', /application\/json/);
		})
	})

	describe('post /users', () => {

		test('debe poder crear un usuario', async () => {
			const response = await api
				.post('/api/users')
				.set('Authorization', `Bearer ${adminToken}`)
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
			.set('Authorization', `Bearer ${adminToken}`)
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
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
					username: 445465,
					password: 'asdasdas',
					name: 'Chamba',
					surname: 'UPT',
					ci: 1112,
					telephone: '04121588783',
					email: 'jesus.com',
					role: '45',
				})
			.expect(400)

			const users = await User.findAll()

			expect(users).toHaveLength(4)
		})

		test('no debe permitir crear un usuario si no hay token', async () => {
			const response = await api
				.post('/api/users')
				.send({
					username: 'chamba2',
					password: 'pepito',
					name: 'Chamba',
					surname: 'UPT',
					ci: '26778126',
					telephone: '04121588783',
					email: 'avijesus15@gmail.com',
					role: '2',
				})
				.expect(401)
				.expect('Content-type', /application\/json/);
		})

		test('no debe permitir crear un usuario si no es admin', async () => {
			const response = await api
				.post('/api/users')
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					username: 'chamba3',
					password: 'pepito',
					name: 'Chamba',
					surname: 'UPT',
					ci: '26778127',
					telephone: '04121588783',
					email: 'avijesus16@gmail.com',
					role: '2',
				})
				.expect(403)
				.expect('Content-type', /application\/json/);
		})
	})

	describe('patch /users', () => {

		test('debe poder editar un usuario correctamente', async () => {
			const response = await api
			.patch('/api/users/4')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				username: 'elchambas',
				password: 'blah456', //la contraseña debe ser mayor a 6 caracteres
				ci: '26778126',
				name: 'pepito',
				surname: 'casas',
				role: 1
			})
			.expect(200)

			const editedUser = await User.findOne({ where : { id: 4 }})

			expect(editedUser.username).toBe('elchambas')
			expect(editedUser.name).toBe('pepito')
			expect(editedUser.surname).toBe('casas') //devuelve lowercase
			expect(editedUser.role_id).toBe(2) //no se debe poder asignar un rol
			expect(editedUser.ci).toBe('26778126')
		})

		test('no debe permitir editar un campo con datos repetidos', async () => {
			const response = await api
			.patch('/api/users/4')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				username: 'jesusaviladev' //nombre repetido
			})
			.expect(400)

			const editedUser = await User.findOne({ where : { id: 4 }})
			expect(editedUser.username).toBe('elchambas')
		})

		test('un usuario puede editar sus datos', async () => {
			const response = await api
			.patch('/api/users/2')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				username: 'manuelito',
				name: 'manu'
			})
			.expect(200)

			const editedUser = await User.findOne({ where : { id: 2 }})

			expect(editedUser.username).toBe('manuelito')
			expect(editedUser.name).toBe('manu')
			expect(editedUser.role_id).toBe(2) //no se debe poder asignar un rol
			expect(editedUser.ci).toBe('26457000')

		})

		test('no debe permitir editar un usuario que no es el consultado', async () => {
			const response = await api
			.patch('/api/users/3')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				username: 'manuelito'
			})
			.expect(403)
		})

	})

	describe('delete /users', () => {
		test('debe poder eliminar un usuario', async () => {
			const response = await api
			.delete('/api/users/4')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)

			const users = await User.findAll()

			expect(users).toHaveLength(3)
		})
		test('un usuario no debe poder eliminar un usuario', async () => {
			const response = await api
			.delete('/api/users/3')
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403)

			const users = await User.findAll()

			expect(users).toHaveLength(3)
		})

		test('no debe permitir eliminar si no hay un token', async () => {
			const response = await api
			.delete('/api/users/3')
			.expect(401)
		})
	})
})

afterAll(async () => {
	await db.drop();
});
