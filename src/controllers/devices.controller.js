const {
	findDevices,
	findDeviceBySerial,
	editDevice,
	deleteDevice,
} = require('../services/devices.services.js');

const devicesController = {};

devicesController.getDevices = async (request, response, next) => {
	const { page = 1, limit = 10 } = request.query;

	try {
		const devices = await findDevices(page, limit);

		return response.status(200).json({
			devices: devices.rows,
			pagination: {
				currentPage: page,
				per_page: limit,
				total: devices.count,
				next: `http://localhost:3001/api/devices?page=${
					page + 1
				}&limit=${limit}`,
			},
		});
	} catch (error) {
		next(error);
	}
};

devicesController.getDeviceBySerialId = async (req, res, next) => {
	const { serial } = req.params;

	const data = req.body;

	try {
		const device = await findDeviceBySerial(serial, data);

		if (!device) {
			return res.status(404).json({
				status: 'No device found',
			});
		}

		return res.status(200).json({
			device,
		});
	} catch (error) {
		next(error);
	}
};

devicesController.editDevice = async (req, res, next) => {
	const { serial } = req.params;

	const data = req.body;

	try {
		const [editedDevice] = await editDevice(serial, data);

		if (editedDevice === 0)
			return res.status(404).json({
				status: 'Device not found',
			});

		return res.status(200).json({
			message: 'Successfully edited device',
		});
	} catch (error) {
		next(error);
	}
};

devicesController.deleteDevice = async (req, res, next) => {
	const { serial } = req.params;

	try {
		const isDeviceDeleted = await deleteDevice(serial);

		if (!isDeviceDeleted) {
			return res.status(404).json({
				status: 'No device found',
			});
		}

		return res.status(200).json({
			message: 'Successfully deleted device',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = devicesController;
