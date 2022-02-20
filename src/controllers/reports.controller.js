const Report = require('../models/reports.model.js')
const reportsController = {}

reportsController.getReports = (request, response) => {
	response.send('get report');
}

reportsController.getReportById = (request, response) => {
	response.send('get report by id');
}

reportsController.createReport = (request, response) => {
	response.send('create report');
}

reportsController.editReport = (request, response) => {
	response.send('edit report');
}

reportsController.deleteReport = (request, response) => {
	response.send('delete report');
}

module.exports = reportsController