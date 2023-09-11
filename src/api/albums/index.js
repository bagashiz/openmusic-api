const AlbumsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'albums' module.
 */
module.exports = {
	name: 'albums',
	version: '1.0.0',
	/**
	 * Registers the albums plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {AlbumsService} options.service - The service for handling albums.
	 * @param {AlbumsValidator} options.validator - The validator for albums.
	 */
	register: async (server, { service, validator }) => {
		const albumsHandler = new AlbumsHandler(service, validator);

		// Register routes with the Hapi.js server
		server.route(routes(albumsHandler));
	},
};
