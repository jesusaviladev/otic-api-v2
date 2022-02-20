const reportsRouter = require('express').Router();
const { getReports, getReportById, createReport, editReport, deleteReport }
= require('../controllers/reports.controller.js')

reportsRouter.get('/', getReports);

reportsRouter.get('/:id', getReportById);

reportsRouter.post('/', createReport);

reportsRouter.patch('/:id', editReport);

reportsRouter.delete('/:id', deleteReport);

module.exports = reportsRouter;
