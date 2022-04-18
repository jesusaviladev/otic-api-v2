const { Op } = require('sequelize');
const Device = require('../models/device.model.js');

const findDevices = async (page, limit) => {
	const devices = await Device.findAndCountAll({
		offset: (page - 1) * limit,
		limit: limit,
	});

	return devices;
};

const findDeviceBySerial = async (serial) => {
	const device = await Device.findOne({
		where: {
			serial: serial,
		},
	});

	return device;
};

const editDevice = async (serial, data) => {
	const editedDevice = await Device.update(data, {
		where: { serial: serial },
	});

	return editedDevice;
};

const deleteDevice = async (serial) => {
	const deletedDevice = await Device.destroy({ where: { serial: serial } });

	return Boolean(deletedDevice);
};

module.exports = {
	findDevices,
	findDeviceBySerial,
	editDevice,
	deleteDevice,
};
