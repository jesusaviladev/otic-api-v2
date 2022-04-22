const Report = require('../models/reports.model.js');
const Request = require('../models/requests.model.js');
const User = require('../models/users.model.js');
const { db } = require('../services/connection.js');
const { Op } = require('sequelize');

const findReports = async (page, limit) => {
	const reports = await Report.findAndCountAll({
		offset: (page - 1) * limit,
		include: {
			model: User,
			attributes: ['username'],
		},
		limit: limit,
	});

	return reports;
};

const findReportById = async (id) => {
	const report = await Report.findOne({ 
		where: { id: id },
		include: {
			model: User,
			attributes: ['username'],
		},

		});

	return report;
};

const addReport = async (data) => {
	const t = await db.transaction();

	try {
		data.date = new Date().toISOString();

		const reportedRequest = await Request.findOne({
			where: { id: data.request_id },
			transaction: t,
		});

		data.user_id = reportedRequest.user_id;

		const report = await Report.create(data, {
			transaction: t,
		});

		reportedRequest.status_id = 3;

		await reportedRequest.save({
			transaction: t,
		});

		await t.commit();

		return report;
	} catch (error) {
		await t.rollback();
		throw new Error(error);
	}
};

const editReport = async (id, data) => {
	const editedReport = await Report.update(data, { where: { id: id } });

	return editedReport;
};

const deleteReport = async (id) => {
	const deletedReport = await Report.destroy({ where: { id: id } });

	return deletedReport;
};

module.exports = {
	findReports,
	findReportById,
	addReport,
	editReport,
	deleteReport,
};
