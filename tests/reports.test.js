const { solicitudes, equipos } = require('./utils/solicitudes');
const { reportes } = require('./utils/reportes')
const { usuarios } = require('./utils/usuarios');
const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const User = require('../src/models/users.model');
const Device = require('../src/models/device.model');
const Request = require('../src/models/requests.model');
const Report = require('../src/models/reports.model');
const supertest = require('supertest')

const api = supertest(app)

let adminToken = '';
let userToken = '';

beforeAll(async () => {
	await checkDBConnection();
	await User.bulkCreate(usuarios)
	await Device.bulkCreate(equipos)
	await Request.bulkCreate(solicitudes)
	await Report.bulkCreate(reportes)

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

})

describe('reportes', () => {

	describe('get /reports', () => {
		test('debe recuperar 2 reportes', async () => {
			const response = await api
			.get('/api/reports')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)
			.expect('Content-type', /application\/json/);

			expect(response.body.reports).toHaveLength(2)
		})

		test('debe responder con paginacion', async () => {
			const response = await api
				.get('/api/reports?limit=1')
				.set('Authorization', `Bearer ${adminToken}`)
				.expect(200)
				.expect('Content-type', /application\/json/);

			expect(response.body.reports).toHaveLength(1)
			expect(response.body.pagination).toBeDefined()
			expect(response.body.pagination.next).toBeDefined()	
		})

		test('no debe responder si no es admin', async () => {
			const response = await api
			.get('/api/reports')
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403)
			.expect('Content-type', /application\/json/);
		})

		test('no debe responder si no hay un token', async () => {
			const response = await api
			.get('/api/reports')
			.expect(401)
			.expect('Content-type', /application\/json/);
		})
	})

	describe('get /reports/:id', () => {
		test('debe responder con un reporte', async () => {
			const response = await api
			.get('/api/reports/2')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)
			.expect('Content-type', /application\/json/);

			expect(response.body.report.comment).toBe("Comprada nueva RAM")
			expect(response.body.report.user_id).toBe(3)
			expect(response.body.report.request_id).toBe(6)
		})

		test('no debe responder si no hay token', async () => {
			const response = await api
			.get('/api/reports/1')
			.expect(401)
		})

		test('no debe responder si el usuario no es admin', async () => {
			const response = await api
			.get('/api/reports/1')
			.set('Authorization', `Bearer ${userToken}`)
			.expect(403)
			.expect('Content-type', /application\/json/);
		})
	})

	describe('post /reports', () => {
		test('debe poder agregar un reporte', async () => {
			const response = await api
			.post('/api/reports')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				comment: "Reparada la tarjeta madre",
				request_id: 1
			})
			.expect(201)

			const reportes = await Report.findAll()
			const solicitud = await Request.findOne({ where: { id: 1 }})

			expect(reportes).toHaveLength(3)
			expect(solicitud.status_id).toBe(3)
			expect(response.body.report.user_id).toBe(3)

		})

		test('no debe poder agregar un reporte de una solicitud que no existe', async() => {
			const response = await api
			.post('/api/reports')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				comment: "Reparada la tarjeta madre",
				request_id: 456
			})
			.expect(400)
		})

		test('no debe poder agregar un reporte si no hay token', async () => {
			const response = await api
			.post('/api/reports')
			.send({
				comment: "Reparada la tarjeta madre",
				request_id: 3
			})
			.expect(401)
		})

		test('no debe poder agregar un reporte si no es el usuario asignado', async () => {
			const response = await api
			.post('/api/reports')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				comment: "Reparada la tarjeta madre",
				request_id: 2
			})
			.expect(403)

			expect(response.body.error).toContain('User is not assigned to this request')
		})
	})
	
	describe('patch /reports', () => {
		test('debe poder editar un reporte', async () => {
			const response = await api
			.patch('/api/reports/2')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				comment: "Reparada la tarjeta madre por luisillo"
			})
			.expect(200)

			const reporte = await Report.findOne({ where: { id: 2 } })

			expect(reporte.comment).toBe("Reparada la tarjeta madre por luisillo")
		})

		test('no debe poder editar un reporte si no hay token', async () => {
			const response = await api
			.patch('/api/reports/3')
			.send({
				comment: "Reparada la tarjeta madre por luisillo"
			})
			.expect(401)
		})

		test('no debe poder editar un reporte si el reporte no pertenece al usuario', async () => {
			const response = await api
			.patch('/api/reports/1')
			.set('Authorization', `Bearer ${userToken}`)
			.send({
				comment: "Reparada la tarjeta madrea a",
			})
			.expect(403)
		})
	})

	describe('delete /reports', () => {
		test('debe poder eliminar un reporte', async () => {
			const response = await api
			.delete('/api/reports/1')
			.set('Authorization', `Bearer ${adminToken}`)
			.expect(200)

			const reportes = await Report.findAll()

			expect(reportes).toHaveLength(2)
		})		
	})
})

afterAll(async () => {
	await db.drop()
})