const SongsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'songs' module.
 */
module.exports = {
	name: 'songs',
	version: '1.0.0',
	/**
	 * Registers the songs plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {SongsService} options.service - The service for handling songs.
	 * @param {SongsValidator} options.validator - The validator for songs.
	 */
	register: async (server, { service, validator }) => {
		const songsHandler = new SongsHandler(service, validator);

		// Register routes with the Hapi.js server
		server.route(routes(songsHandler));
	},
};
