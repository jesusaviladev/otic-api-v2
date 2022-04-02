const equipos = [
	{
		serial: 'BN157333',
		type: 'Escritorio',
		name: 'PC-VIT 118',
	},
	{
		serial: 'BN157784',
		type: 'Escritorio',
		name: 'PC-VIT 113',
	},
];

const solicitudes = [
	{
		description: 'Equipo dañado por tarjeta madre',
		user_id: 3,
		status_id: 2,
		device_id: 2,
		date: new Date().toISOString(),
	},
	{
		description: 'Pantalla dañada',
		user_id: 4,
		status_id: 2,
		device_id: 1,
		date: new Date().toISOString(),
	},
	{
		description: 'No tiene RAM',
		user_id: 3,
		status_id: 2,
		device_id: 1,
		date: new Date().toISOString(),
	},
	{
		description: 'Debe arreglarse el mouse',
		user_id: null,
		status_id: 1,
		device_id: 1,
		date: new Date().toISOString(),
	},
	{
		description: 'Debe arreglarse el mouse',
		user_id: 4,
		status_id: 3,
		device_id: 2,
		date: new Date().toISOString(),
	},
	{
		description: 'Debe añadirse nueva ram',
		user_id: 3,
		status_id: 3,
		device_id: 2,
		date: new Date().toISOString(),
	}
];

module.exports = {
	solicitudes,
	equipos,
};
