const reportsRouter = require('express').Router();
const {
	getReports,
	getReportById,
	createReport,
	editReport,
	deleteReport,
} = require('../controllers/reports.controller.js');
const { verifyToken, checkAdmin } = require('../middlewares/auth.js');
const {
	validateReport,
	validateEditedReport,
	validateParams,
} = require('../middlewares/validation.js');

reportsRouter.get('/', verifyToken, checkAdmin, validateParams, getReports);

reportsRouter.get('/:id', verifyToken, getReportById);

reportsRouter.post('/', verifyToken, validateReport, createReport);

reportsRouter.patch('/:id', verifyToken, validateEditedReport, editReport);

reportsRouter.delete('/:id', verifyToken, checkAdmin, deleteReport);

module.exports = reportsRouter;
