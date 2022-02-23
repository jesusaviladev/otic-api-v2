const Report = require('../models/reports.model.js')
const Request = require('../models/requests.model.js')

const findReports = async () => {
	const reports = await Report.findAll()

	return reports
}

const findReportById = async (id) => {
	const report = await Report.findOne({ where: { id: id }})

	return report
}

const addReport = async (data) => {

	data.date = new Date().toISOString()

	const report = await Report.create(data)

	const reportedRequest = await Request.findOne({ where : { id: data.request_id }})

	reportedRequest.status_id = 3

	await reportedRequest.save()

	console.log(reportedRequest)



	return report
}

const editReport = async (id, data) => {

	const editedReport = await Report.update(data, { where: { id: id }})

	return editedReport
}

const deleteReport = async (id) => {

	const deletedReport = await Report.destroy({ where: { id: id }})

	return deletedReport
}

module.exports = {
	findReports,
	findReportById,
	addReport,
	editReport,
	deleteReport
}