const devicesRouter = require('express').Router();
const {
	getDevices,
	getDeviceBySerialId,
	editDevice,
	deleteDevice,
} = require('../controllers/devices.controller.js');

const { verifyToken, checkAdmin } = require('../middlewares/auth.js');
const {
	validateParams,
	validateEditedDevice,
} = require('../middlewares/validation.js');

devicesRouter.get('/', verifyToken, validateParams, getDevices);

devicesRouter.get('/:serial', verifyToken, getDeviceBySerialId);

devicesRouter.patch(
	'/:serial',
	verifyToken,
	checkAdmin,
	validateEditedDevice,
	editDevice
);

devicesRouter.delete('/:serial', verifyToken, checkAdmin, deleteDevice);

module.exports = devicesRouter;
