const getPagination = (data, limit, req) => {

	const path = req.baseUrl

	let nextCursor = null;

		if (data.length > 0 && data.length > limit) {
			data.pop();
			nextCursor = `http://localhost:3000${path}?since_id=${
				data[data.length - 1].id
			}&limit=${limit}`;
		}

	return {
		data,
		pagination: {
			next: nextCursor
		}
	};
};

module.exports = getPagination;
