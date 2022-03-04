const bcrypt = require('bcrypt');

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const checkPassword = async (password, hashedPassword) =>
	await bcrypt.compare(password, hashedPassword);

module.exports = {
	hashPassword,
	checkPassword
}
