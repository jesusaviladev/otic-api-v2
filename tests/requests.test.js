const { solicitudes, equipos } = require('./utils/solicitudes');
const { usuarios } = require('./utils/usuarios');
const { app, checkDBConnection } = require('../src/app.js');
const { db } = require('../src/services/connection.js');
const User = require('../src/models/users.model');
const Device = require('../src/models/device.model');
const Request = require('../src/models/requests.model');
const supertest = require('supertest')

const api = supertest(app)

beforeAll(async () => {
	try {
		await checkDBConnection();
		await User.bulkCreate(usuarios);
		await Device.bulkCreate(equipos);
		await Request.bulkCreate(solicitudes);
	} catch (error) {
		console.log(error);
	}
});

describe('solicitudes', () => {
	test('debe haber 2 equipos y 5 solicitudes', async () => {
		const equipos = await Device.findAll();
		const solicitudes = await Request.findAll();

		expect(equipos).toHaveLength(2);
		expect(solicitudes).toHaveLength(5);
	});

	test('debe poder recuperar las solicitudes', async () => {
		
		const response = await api
		.get('/api/requests')
		.expect(200)
		.expect('Content-type', /application\/json/);
		
		expect(response.body.requests).toHaveLength(5)
	})

	test('debe poder recuperar las solicitudes segun id', async () => {
		
		const response = await api
		.get('/api/requests/3')
		.expect(200)
		.expect('Content-type', /application\/json/);
		
		expect(response.body.request.id).toBe(3)
		expect(response.body.request.description)
		.toBe('No tiene RAM')
		expect(response.body.request.serial_id).toBe('BN157333')
	})

	test('debe poder ingresar una solicitud de un equipo que existe', async () => {
		const response = await api
		.post('/api/requests')
		.send({
		description: 'Equipo no tiene pantalla',
		userId: 3,
		device: {
			exists: true,
			serial: 'BN157784',
			type: 'Escritorio',
			name: 'PC-VIT'
		}
		})
		.expect(200)

		const solicitudes = await Request.findAll();

		expect(solicitudes).toHaveLength(6)
		expect(response.body.request.serial_id).toBe('BN157784')
	})

	test('debe poder ingresar una solicitud de un equipo que no existe', async () => {
		const response = await api
		.post('/api/requests')
		.send({
			description: 'Tarjeta de red dañada',
			userId: 2,
			device: {
				exists: false,
				serial: 'BN147588',
				type: 'Escritorio',
				name: 'PC-VIT 38'
			}
		})
		.expect(200)

		const solicitudes = await Request.findAll();
		const equipos = await Device.findAll()

		expect(solicitudes).toHaveLength(7)
		expect(response.body.request.request.serial_id).toBe('BN147588')
		expect(response.body.request.request.description).toBe('Tarjeta de red dañada')
		expect(equipos).toHaveLength(3)
	})

	test('no debe permitir ingresar una solicitud con datos erroneos', async () => {

		const response = await api
		.post('/api/requests')
		.send({
			description: 'Monitor no enciende'
		})
		.expect(400)

		const solicitudes = await Request.findAll();
		const equipos = await Device.findAll()

		expect(solicitudes).toHaveLength(7)
		expect(equipos).toHaveLength(3)
	})

	test('si el id del equipo no existe, debe arrojar un error', async () => {

		const response = await api
		.post('/api/requests')
		.send({
			description: 'Tarjeta de red dañada',
			userId: 2,
			device: {
				exists: true,
				serial: 'JKFR8989', //serial que no existe en la BD
				type: 'Escritorio',
				name: 'PC-VIT 38'
			}
		})
		.expect(400)

		const solicitudes = await Request.findAll();

		expect(solicitudes).toHaveLength(7)
	})

	test('debe poder editar una solicitud correctamente', async () => {

		const response = await api
		.patch('/api/requests/4')
		.send({
			description: 'Debe arreglarse el mouse editado',
			user_id: 3,
			status: 2,
			serial_id: 'JKFR8989',
		})
		.expect(200)

		const solicitud = await Request.findOne({ where: { id : 4 }})

		expect(solicitud.description).toBe('Debe arreglarse el mouse editado')
		expect(solicitud.user_id).toBe(3)
		expect(solicitud.status_id).toBe(2)
		expect(solicitud.serial_id).toBe('BN157333')

	})

	test('debe arrojar un error al editar una solicitud con datos erroneos', async () => {
		const response = await api
		.patch('/api/requests/4')
		.send({
			description: 'Debe arreglarse el mouse editado 456465',
			user_id: 456,
			status: 78,
			serial_id: 'JKFR8989',
		})
		.expect(400)

		const solicitud = await Request.findOne({ where: { id : 4 }})

		expect(solicitud.description).toBe('Debe arreglarse el mouse editado')
		expect(solicitud.user_id).toBe(3)
		expect(solicitud.status_id).toBe(2)
		expect(solicitud.serial_id).toBe('BN157333')
	})

	test('debe poder eliminar una solicitud', async () => {
		const response = await api
		.delete('/api/requests/5')
		.expect(200)

		const solicitudes = await Request.findAll()

		expect(solicitudes).toHaveLength(6)
	})

});

afterAll(async () => {
	await db.drop();
});
