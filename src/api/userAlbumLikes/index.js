const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'userAlbumLikes' module.
 */
module.exports = {
	name: 'userAlbumLikes',
	version: '1.0.0',
	/**
	 * Registers the userAlbumLikes plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {UserAlbumLikesService} options.userAlbumLikesService - The service for user album likes.
	 * @param {AlbumsService} options.albumsService - The service for albums.
	 */
	register: async (server, { userAlbumLikesService, albumsService }) => {
		const userAlbumLikesHandler = new UserAlbumLikesHandler(userAlbumLikesService, albumsService);

		// Register routes with the Hapi.js server
		server.route(routes(userAlbumLikesHandler));
	},
};
