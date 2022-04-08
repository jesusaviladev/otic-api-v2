const Device = require('../models/device.model.js');
const Request = require('../models/requests.model.js');
const User = require('../models/users.model.js');
const Status = require('../models/status.model.js');
const { Op } = require('sequelize');
const { db } = require('../services/connection.js');

const findRequests = async (cursor, limit) => {
	const requests = await Request.findAll({
		where: {
			id: {
				[Op.gt]: cursor,
			},
		},
		limit: limit + 1,
		include: [
			{
				model: User,
				attributes: ['username'],
			},
			{
				model: Status,
				attributes: ['description'],
			},
		],
	});

	return requests;
};

const findRequestById = async (id) => {
	const request = await Request.findOne({ where: { id: id } });

	return request;
};

const addRequest = async (data) => {
	const { description, device, user_id = null } = data;

	const status = user_id ? 2 : 1;

	if (!device.exists) {
		// flag para saber si existe el equipo en BD

		const t = await db.transaction();

		try {
			const createdDevice = await Device.create(
				{
					serial: device.serial,
					type: device.type,
					name: device.name,
				},
				{
					transaction: t,
				}
			);

			const createdRequest = await Request.create(
				{
					date: new Date().toISOString(),
					description,
					user_id,
					status_id: status,
					device_id: createdDevice.id,
				},
				{
					transaction: t,
				}
			);

			await t.commit();

			return {
				device: createdDevice,
				request: createdRequest,
			};
		} catch (error) {
			await t.rollback();
			throw new Error(error);
		}
	} else {
		const existingDevice = await Device.findOne({
			where: {
				serial: device.serial,
			},
		});

		const createdRequest = await Request.create({
			date: new Date().toISOString(),
			description,
			user_id,
			status_id: status,
			device_id: existingDevice.id,
		});

		return createdRequest;
	}
};

const editRequest = async (id, data) => {
	const { user_id } = data;

	if (user_id) {
		data.status_id = 2;
	}

	const editedRequest = await Request.update(data, {
		where: { id: id },
	});

	return editedRequest;
};

const deleteRequest = async (id) => {
	const deletedRequest = await Request.destroy({ where: { id: id } });

	return Boolean(deletedRequest);
};

module.exports = {
	findRequests,
	findRequestById,
	addRequest,
	editRequest,
	deleteRequest,
};
