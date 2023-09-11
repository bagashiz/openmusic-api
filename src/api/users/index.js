const UsersHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'users' module.
 */
module.exports = {
	name: 'users',
	version: '1.0.0',
	/**
	 * Registers the users plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services and validator.
	 * @param {UsersService} options.service - The service for users.
	 * @param {UsersValidator} options.validator - The validator for users.
	 */
	register: async (server, { service, validator }) => {
		const usersHandler = new UsersHandler(service, validator);

		// Register routes with the Hapi.js server
		server.route(routes(usersHandler));
	},
};
