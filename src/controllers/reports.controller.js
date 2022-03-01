const {
	findReports,
	findReportById,
	addReport,
	editReport,
	deleteReport,
} = require('../services/reports.services.js');
const getPagination = require('../utils/getPagination.js');

const reportsController = {};

reportsController.getReports = async (request, response, next) => {
	const { since_id = 0, limit = 10 } = request.query;

	try {
		const reports = await findReports(since_id, limit);

		const { data, pagination } = getPagination(reports, limit, request);

		return response.status(200).json({
			reports: data,
			pagination
		});
		
	} catch (error) {
		next(error);
	}
};

reportsController.getReportById = async (request, response, next) => {
	const { id } = request.params
	try {
		const report = await findReportById(id);

		if(!report) return response.status(404).json({
			status: 'No report found'
		})

		return response.status(200).json({
			report
		});
	} catch (error) {
		next(error);
	}
};

reportsController.createReport = async (request, response, next) => {
	const data = request.body

	try {
		const createdReport = await addReport(data);

		return response.status(201).json({
			report: createdReport
		});
	} catch (error) {
		next(error);
	}
};

reportsController.editReport = async (request, response, next) => {
	const { id } = request.params
	const data = request.body

	try {
		const [editedReport] = await editReport(id, data);

		if (editedReport === 0)
			return response.status(404).json({
				status: 'Report not found',
			});
		
		return response.status(200).json({
			message: 'Successfully deleted report'
		});
	} catch (error) {
		next(error);
	}
};

reportsController.deleteReport = async (request, response, next) => {
	const { id } = request.params

	try {
		const deletedReport = await deleteReport(id);

		if (!deletedReport) {
			return response.status(404).json({
				status: 'No report found',
			});
		}

		return response.status(200).json();

	} catch (error) {
		next(error);
	}
};

module.exports = reportsController;
