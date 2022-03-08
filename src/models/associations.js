const Role = require('./roles.model.js');
const Status = require('./status.model.js');
const User = require('./users.model.js');
const Request = require('./requests.model.js');
const Report = require('./reports.model.js');
const Device = require('./device.model.js');

Role.hasMany(User, {
	foreignKey: {
		name: 'role_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

User.belongsTo(Role, {
	foreignKey: {
		name: 'role_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

User.hasMany(Request, {
	foreignKey: {
		name: 'user_id',
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Request.belongsTo(User, {
	foreignKey: {
		name: 'user_id',
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Status.hasMany(Request, {
	foreignKey: {
		name: 'status_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Request.belongsTo(Status, {
	foreignKey: {
		name: 'status_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Device.hasMany(Request, {
	foreignKey: {
		name: 'serial_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Request.belongsTo(Device, {
	foreignKey: {
		name: 'serial_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

User.hasMany(Report, {
	foreignKey: {
		name: 'user_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Report.belongsTo(User, {
	foreignKey: {
		name: 'user_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Request.hasOne(Report, {
	foreignKey: {
		name: 'request_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});

Report.belongsTo(Request, {
	foreignKey: {
		name: 'request_id',
		allowNull: false,
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	},
});
