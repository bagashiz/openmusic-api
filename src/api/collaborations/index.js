const CollaborationsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'openmusic-collaborations' module.
 */
module.exports = {
	name: 'openmusic-collaborations',
	version: '1.0.0',
	/**
	 * Registers the openmusic-collaborations plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {CollaborationsService} options.collaborationsService - The service for handling collaborations.
	 * @param {UsersService} options.usersService - The service for handling users.
	 * @param {PlaylistsService} options.playlistsService - The service for handling playlists.
	 * @param {CollaborationsValidator} options.validator - The validator for collaborations.
	 */
	register: async (
		server,
		{ collaborationsService, usersService, playlistsService, validator }
	) => {
		const collaborationshandler = new CollaborationsHandler(
			collaborationsService,
			usersService,
			playlistsService,
			validator
		);

		// Register routes with the Hapi.js server
		server.route(routes(collaborationshandler));
	},
};
