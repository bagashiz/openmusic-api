const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'authentications' module.
 */
module.exports = {
	name: 'authentications',
	version: '1.0.0',
	/**
	 * Registers the authentications plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {AuthenticationsService} options.authenticationsService - The service for handling authentications.
	 * @param {UsersService} options.usersService - The service for handling users.
	 * @param {TokenManager} options.tokenManager - The token manager service.
	 * @param {AuthenticationsValidator} options.validator - The validator for authentications.
	 */
	register: async (server, { authenticationsService, usersService, tokenManager, validator }) => {
		const authenticationsHandler = new AuthenticationsHandler(
			authenticationsService,
			usersService,
			tokenManager,
			validator
		);

		// Register routes with the Hapi.js server
		server.route(routes(authenticationsHandler));
	},
};
