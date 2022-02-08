const authController = {}

authController.signup = (request, response) => {
	response.send("register controller");
};

authController.login = (request, response) => {
	response.send("login controller");
};

module.exports = authController;
