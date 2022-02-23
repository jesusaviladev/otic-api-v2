const {
	findReports,
	findReportById,
	addReport,
	editReport,
	deleteReport,
} = require('../services/reports.services.js');

const reportsController = {};

reportsController.getReports = async (request, response, next) => {
	try {
		const reports = await findReports();

		return response.status(200).json({
			reports,
		});
	} catch (error) {
		next(error);
	}
};

reportsController.getReportById = async (request, response, next) => {
	const { id } = request.params
	try {
		const report = await findReportById(id);

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
			createdReport
		});
	} catch (error) {
		next(error);
	}
};

reportsController.editReport = async (request, response, next) => {
	const { id } = request.params
	const data = request.body

	try {
		const editedReport = await editReport(id, data);
		
		return response.status(200).json({
			editedReport
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

		return response.status(200).json({
			message: 'Successfully deleted report'
		});

	} catch (error) {
		next(error);
	}
};

module.exports = reportsController;
