const getPagination = (page, limit) => {

	const regEx = /^([1-9][0-9]?|100)$/;

	if(!regEx.test(page) || !regEx.test(limit)){
		throw new Error('InvalidQuery');
	}
	
	const offset = (page - 1) * limit;
	const queryLimit = Number(limit);

	return {
		offset,
		queryLimit
	}

}


module.exports = getPagination;