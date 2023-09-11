const routes = require('./routes');
const PlaylistsHandler = require('./handler');

/**
 * The plugin configuration for the 'openmusic-playlists' module.
 */
module.exports = {
	name: 'openmusic-playlists',
	version: '1.0.0',
	/**
	 * Registers the openmusic-playlists plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {PlaylistsService} options.playlistsService - The service for handling playlists.
	 * @param {SongsService} options.songsService - The service for handling songs.
	 * @param {ActivitiesService} options.activitiesService - The service for handling activities.
	 * @param {TokenManager} options.tokenManager - The token manager service.
	 * @param {PlaylistsValidator} options.validator - The validator for playlists.
	 */
	register: async (
		server,
		{ playlistsService, songsService, activitiesService, tokenManager, validator }
	) => {
		const playlistHandler = new PlaylistsHandler(
			playlistsService,
			songsService,
			activitiesService,
			tokenManager,
			validator
		);

		// Register routes with the Hapi.js server
		server.route(routes(playlistHandler));
	},
};
