const reportsRouter = require('express').Router();
const { getReports, getReportById, createReport, editReport, deleteReport }
= require('../controllers/reports.controller.js')

const { validateReport, validateEditedReport } = require('../middlewares/validation.js')

reportsRouter.get('/', getReports);

reportsRouter.get('/:id', getReportById);

reportsRouter.post('/', validateReport, createReport);

reportsRouter.patch('/:id', validateEditedReport, editReport);

reportsRouter.delete('/:id', deleteReport);

module.exports = reportsRouter;
