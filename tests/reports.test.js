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

beforeAll(async () => {
	await checkDBConnection();
	await User.bulkCreate(usuarios)
	await Device.bulkCreate(equipos)
	await Request.bulkCreate(solicitudes)
	await Report.bulkCreate(reportes)

})

describe('reportes', () => {

	test('debe haber un reporte', async () => {
		const reportes = await Report.findAll()

		expect(reportes).toHaveLength(1)
	})

	test('debe poder recuperar los reportes', async () => {
		const response = await api
		.get('/api/reports')
		.expect(200)
		.expect('Content-type', /application\/json/);

		expect(response.body.reports).toHaveLength(1)
	})
	
	test('debe poder agregar un reporte', async () => {
		const response = await api
		.post('/api/reports')
		.send({
			comment: "Reparada la tarjeta madre",
			user_id: 2,
			request_id: 1
		})
		.expect(201)


		const reportes = await Report.findAll()
		const solicitud = await Request.findOne({ where: { id: 1 }})

		expect(reportes).toHaveLength(2)
		expect(solicitud.status_id).toBe(3)

	})

	test('debe poder editar un reporte', async () => {
		const response = await api
		.patch('/api/reports/2')
		.send({
			comment: "Reparada la tarjeta madre por luisillo"
		})
		.expect(200)

		const reporte = await Report.findOne({ where: { id: 2 } })

		expect(reporte.comment).toBe("Reparada la tarjeta madre por luisillo")
	})

	test('debe poder eliminar un reporte', async () => {
		const response = await api
		.delete('/api/reports/1')
		.expect(200)

		const reportes = await Report.findAll()

		expect(reportes).toHaveLength(1)
	})
})

afterAll(async () => {
	await db.drop()
})