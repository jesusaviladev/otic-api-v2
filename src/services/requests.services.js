const Request = require('../models/requests.model.js')
const Device = require('../models/device.model.js')
const { db } = require('../services/connection.js')

const findRequests = async () => {

	const requests = await Request.findAll({})

	return requests
}

const findRequestById = async (id) => {
	const request = await Request.findOne({ where: { id: id }})

	return request
}

const addRequest = async (data) => {

	const { description, device, userId = null } = data

	const status = userId ? 2 : 1

	if(!device.exists){ //flag para saber si existe el equipo en BD

		const t = await db.transaction()

		try {

			const createdDevice = await Device.create({
				serial: device.serial,
				type: device.type,
				name: device.name
			}, {
				transaction: t
			})

			const createdRequest = await Request.create({
				date: new Date().toISOString(),
				description,
				user_id: userId,
				status_id: status,
				serial_id: createdDevice.serial
			}, {
				transaction: t
			})

			await t.commit()

			return {
				createdDevice,
				createdRequest
			}

		} catch (error){
			console.log(error)
			console.log('Aqui estoy, no me cree')
			await t.rollback();
		}

	} else {
		const createdRequest = Request.create({
				date: new Date().toISOString(),
				description,
				user_id: userId,
				status_id: status,
				serial_id: device.serial
		})

		return createdRequest
	}
}

const editRequest = async (id, data) => {

	const editedRequest = await Request.update(data, {
		where: { id: id }
	})

	return editedRequest
}

const deleteRequest = async (id) => {

	const deletedRequest = await Request.destroy({ where: { id: id }})

	return Boolean(deletedRequest)
}

module.exports = {
	findRequests,
	findRequestById,
	addRequest,
	editRequest,
	deleteRequest
}