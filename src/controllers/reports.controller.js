const getPagination = require('../utils/getPagination.js');
const reportsController = {};
const {
	findReports,
	findReportById,
	addReport,
	editReport,
	deleteReport,
} = require('../services/reports.services.js');
const { findUserById } = require('../services/users.services.js');
const { findRequestById } = require('../services/requests.services.js');

reportsController.getReports = async (request, response, next) => {
	const { since_id = 0, limit = 10 } = request.query;

	try {
		const reports = await findReports(since_id, limit);

		const { data, pagination } = getPagination(reports, limit, request);

		return response.status(200).json({
			reports: data,
			pagination,
		});
	} catch (error) {
		next(error);
	}
};

reportsController.getReportById = async (request, response, next) => {
	const { id } = request.params;
	try {
		const user = await findUserById(request.user.id);

		const report = await findReportById(id);

		if (!report)
			return response.status(404).json({
				status: 'No report found',
			});

		if (!user || (user.role.name !== 'admin' && report.user_id !== user.id)) {
			return response.status(403).json({
				error: 'User not allowed to see this record',
			});
		}

		return response.status(200).json({
			report,
		});
	} catch (error) {
		next(error);
	}
};

reportsController.createReport = async (req, res, next) => {
	const data = req.body;
	const requestId = req.body.request_id;

	try {
		const user = await findUserById(req.user.id);
		const request = await findRequestById(requestId);

		if (!request.user_id) {
			return res.status(400).json({
				error: 'Request must have an assigned user first',
			});
		}

		if (!user) {
			return res.status(400).json({
				error: 'User does not exists',
			});
		}

		if (user.role.name !== 'admin' && request.user_id !== user.id) {
			return res.status(403).json({
				error: 'User is not assigned to this request',
			});
		}

		const createdReport = await addReport(data);

		return res.status(201).json({
			report: createdReport,
		});
	} catch (error) {
		next(error);
	}
};

reportsController.editReport = async (request, response, next) => {
	const { id } = request.params;
	const data = request.body;

	try {
		const user = await findUserById(request.user.id);
		const report = await findReportById(id);

		if (!report)
			return response.status(404).json({
				status: 'Report not found',
			});

		if (!user || (user.role.name !== 'admin' && report.user_id !== user.id)) {
			return response.status(403).json({
				error: 'User not allowed',
			});
		}

		const [editedReport] = await editReport(id, data);

		return response.status(200).json({
			message: 'Successfully edited report',
		});
	} catch (error) {
		next(error);
	}
};

reportsController.deleteReport = async (request, response, next) => {
	const { id } = request.params;

	try {
		const deletedReport = await deleteReport(id);

		if (!deletedReport) {
			return response.status(404).json({
				status: 'No report found',
			});
		}

		return response.status(200).json({
			message: 'Successfully deleted report',
		});
	} catch (error) {
		next(error);
	}
};

module.exports = reportsController;
