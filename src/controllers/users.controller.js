const usersController = {};

usersController.getUsers = (request, response) => {
	response.send("get users");
};

usersController.getUserById = (request, response) => {
	response.send("get user by id");
};

usersController.createUser = (request, response) => {
	response.send("create user");
};

usersController.editUser = (request, response) => {
	response.send("edit user");
};

usersController.deleteUser = (request, response) => {
	response.send("delete user");
};

module.exports = usersController