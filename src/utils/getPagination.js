const getPagination = (since_id, limit) => {
	const cursor = Number(since_id);
	const queryLimit = Number(limit) + 1;

	return {
		cursor,
		queryLimit,
	};
};

module.exports = getPagination;
