const { solicitudes, equipos } = require('./utils/solicitudes');
const { usuarios } = require('./utils/usuarios');
const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const User = require('../src/models/users.model');
const Device = require('../src/models/device.model');
const Request = require('../src/models/requests.model');
const supertest = require('supertest')

const api = supertest(app)

let adminToken = '';
let userToken = '';

beforeAll(async () => {
	try {
		await checkDBConnection();
		await User.bulkCreate(usuarios);
		await Device.bulkCreate(equipos);
		await Request.bulkCreate(solicitudes);

	const responseAdmin = await api.post('/api/auth/login').send({
		username: 'admin',
		password: 'pepito'
	})

	const responseUser = await api.post('/api/auth/login').send({
		username: 'manueljerez',
		password: 'pepito'
	})

	adminToken = responseAdmin.body.token
	userToken = responseUser.body.token

	} catch (error) {
		console.log(error);
	}
});

describe('endpoints de solicitudes', () => {

	describe('get /requests', () => {

		test('debe responder con 6 solicitudes', async () => {
			
			const response = await api
			.get('/api/requests')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)
			.expect('Content-type', /application\/json/);
			
			expect(response.body.requests).toHaveLength(6)
		})

		test('debe responder con paginacion', async () => {
			const response = await api
				.get('/api/requests?limit=2')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.requests).toHaveLength(2)
			expect(response.body.pagination).toBeDefined()
			expect(response.body.pagination.next).toBeDefined()	
		})

		test('no debe devolver nada si no se envia un token', async () => {
			const response = await api
				.get('/api/requests')
				.expect(401)
				.expect('Content-type', /application\/json/);	
		})

		test('no debe responder si el usuario no es admin', async () => {
			const response = await api
				.get('/api/requests')
				.set('Authorization', `Bearer ${userToken}`)
				.expect(403)
				.expect('Content-type', /application\/json/);
		})
	})

	describe('get /requests/:id', () => {
		test('debe poder recuperar las solicitudes segun id', async () => {
			
			const response = await api
			.get('/api/requests/3')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)
			.expect('Content-type', /application\/json/);
			
			expect(response.body.request.id).toBe(3)
			expect(response.body.request.description)
			.toBe('No tiene RAM')
			expect(response.body.request.device_id).toBe(1)
			expect(response.body.request.user_id).toBe(3)
		})

		test('no debe devolver nada si no se envia un token', async () => {
			const response = await api
				.get('/api/requests/2')
				.expect(401)
				.expect('Content-type', /application\/json/);	
		})

		test('no debe responder si la request no esta asignada a ese usuario', async () => {
			const response = await api
			.get('/api/requests/2')
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403)
			.expect('Content-type', /application\/json/);

		})
	})


	describe('post /requests', () => {

		test('debe poder ingresar una solicitud de un equipo que existe', async () => {
			const response = await api
			.post('/api/requests')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
			description: 'Equipo no tiene pantalla',
			user_id: 3,
			device: {
				exists: true,
				serial: 'BN157784'
			}
			})
			.expect(201)

			const solicitudes = await Request.findAll();

			expect(solicitudes).toHaveLength(7)
			expect(response.body.request.device_id).toBe(2)
			expect(response.body.request.user_id).toBe(3)
		})

		test('debe poder ingresar una solicitud de un equipo que no existe', async () => {
			const response = await api
			.post('/api/requests')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				description: 'Tarjeta de red dañada',
				user_id: 2,
				device: {
					exists: false,
					serial: 'BN147588',
					type: 'Escritorio',
					name: 'PC-VIT 38'
				}
			})
			.expect(201)

			const solicitudes = await Request.findAll();
			const equipos = await Device.findAll()

			expect(solicitudes).toHaveLength(8)
			expect(response.body.request.device_id).toBe(3)
			expect(response.body.request.description).toBe('Tarjeta de red dañada')
			expect(equipos).toHaveLength(3)
			expect(response.body.request.user_id).toBe(2)
		})

		test('no debe permitir ingresar una solicitud con datos erroneos', async () => {

			const response = await api
			.post('/api/requests')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				description: 'Monitor no enciende'
			})
			.expect(400)

			const solicitudes = await Request.findAll();
			const equipos = await Device.findAll()

			expect(solicitudes).toHaveLength(8)
			expect(equipos).toHaveLength(3)
		})

		test('si el id del equipo no existe, debe arrojar un error', async () => {

			const response = await api
			.post('/api/requests')
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				description: 'Tarjeta de red dañada',
				user_id: 2,
				device: {
					exists: true,
					serial: 'JKFR8989' //serial que no existe en la BD
				}
			})
			.expect(400)

			const solicitudes = await Request.findAll();

			expect(solicitudes).toHaveLength(8)
		})

		test('no debe poder asignar un usuario si no es admin', async () => {
			const response = await api
			.post('/api/requests')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
			description: 'No enciende el monitor',
			user_id: 3,
			device: {
				exists: false,
				serial: 'BN154587',
				type: 'Escritorio',
				name: 'PC-VIT-2'
			}
			})
			.expect(201)
			
			const solicitud = await Request.findOne({ where: { id: 9 }})

			expect(solicitud.user_id).toBe(null)
		})

		test('no debe poder agregar una solicitud si no hay un token', async () =>{
			const response = await api
			.post('/api/requests')
			.send({
			description: 'No enciende el monitor',
			user_id: 2,
			device: {
				exists: true,
				serial: 'BN154587'
			}
			})
			.expect(401)
		})
	})

	describe('patch /requests', () => {
		test('debe poder editar una solicitud correctamente', async () => {

				const response = await api
				.patch('/api/requests/4')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					description: 'Debe arreglarse el mouse editado',
					user_id: 3,
					device_id: 2,
				})
				.expect(200)

				const solicitud = await Request.findOne({ where: { id : 4 }})

				expect(solicitud.description).toBe('Debe arreglarse el mouse editado')
				expect(solicitud.user_id).toBe(3)
				expect(solicitud.status_id).toBe(2)
				expect(solicitud.device_id).toBe(1)

			})

			test('debe arrojar un error al editar una solicitud con datos erroneos', async () => {
				const response = await api
				.patch('/api/requests/4')
				.set('Authorization', `Bearer ${adminToken}`)
				.send({
					description: 'Debe arreglarse el mouse editado 456465',
					user_id: 456,
					status: 78,
					device_id: 'JKFR8989',
				})
				.expect(400)

				const solicitud = await Request.findOne({ where: { id : 4 }})

				expect(solicitud.description).toBe('Debe arreglarse el mouse editado')
				expect(solicitud.user_id).toBe(3)
				expect(solicitud.status_id).toBe(2)
				expect(solicitud.device_id).toBe(1)
			})

			test('no debe poder editar si el usuario no es admin', async () =>{
				const response = await api
				.patch('/api/requests/2')
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					description: 'Teclado dañado'
				})
				.expect(403)

				const solicitud = await Request.findOne({ where: { id : 2 }})

				expect(solicitud.description).toBe('Pantalla dañada')
				expect(solicitud.user_id).toBe(4)
				expect(solicitud.status_id).toBe(2)
				expect(solicitud.device_id).toBe(1)
			})
	})

	describe('delete /requests', () => {
		test('debe poder eliminar una solicitud', async () => {
				const response = await api
				.delete('/api/requests/5')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)

				const solicitudes = await Request.findAll()

				expect(solicitudes).toHaveLength(8)
			})

		test('no debe poder eliminar si el usuario no es admin', async () => {
			const response = await api
			.delete('/api/users/3')
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403)
		})

		test('no debe eliminar si no hay token', async () => {
			const response = await api
			.delete('/api/requests/6')
			.expect(401)
		})
	})

});

afterAll(async () => {
	await db.drop();
});
