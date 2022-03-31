const {
	findDevices,
	findDeviceBySerial,
	editDevice,
	deleteDevice
} = require('../services/devices.services.js')
const getPagination = require('../utils/getPagination.js')

const devicesController = {};

devicesController.getDevices = async (request, response, next) => {
	const { since_id = 0, limit = 10 } = request.query;

	try {
		const devices = await findDevices(since_id, limit);

		const { data, pagination } = getPagination(devices, limit, request);

		return response.status(200).json({
			devices: data,
			pagination,
		});
	} catch (error) {
		next(error);
	}
}

devicesController.getDeviceBySerialId = async (req, res, next) => {

	const { serial } = req.params

	const data = req.body

	try {

		const device = await findDeviceBySerial(serial, data)

		if(!device){
			return res.status(404).json({
				status: 'No device found'
			})
		}

		return res.status(200).json({
			device
		})
	}

	catch (error){
		next(error)
	}
}

devicesController.editDevice = async (req, res, next) => {

	const { serial } = req.params

	const data = req.body;

	console.log(req.body)

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
}

devicesController.deleteDevice = async (req, res, next) => {

	const { serial } = req.params

	try {

		const isDeviceDeleted = await deleteDevice(serial)

		if(!isDeviceDeleted){
			return res.status(404).json({
				status: 'No device found'
			})
		}

		return res.status(200).json({
			message: 'Successfully deleted device',
		})
	}

	catch (error){
		next(error)
	}
}

module.exports = devicesController
