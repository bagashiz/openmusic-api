const ExportsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'exports' module.
 */
module.exports = {
	name: 'exports',
	version: '1.0.0',
	/**
	 * Registers the exports plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {ProducerService} options.producerService - The service for exporting data.
	 * @param {PlaylistsService} options.playlistsService - The service for handling playlists.
	 * @param {ExportsValidator} options.validator - The validator for exports.
	 */
	register: async (server, { producerService, playlistsService, validator }) => {
		const exportsHandler = new ExportsHandler(producerService, playlistsService, validator);

		// Register routes with the Hapi.js server
		server.route(routes(exportsHandler));
	},
};
