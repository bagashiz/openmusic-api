const UploadsHandler = require('./handler');
const routes = require('./routes');

/**
 * The plugin configuration for the 'uploads' module.
 */
module.exports = {
	name: 'uploads',
	version: '1.0.0',
	/**
	 * Registers the uploads plugin with the Hapi.js server.
	 *
	 * @param {Server} server - The Hapi.js server instance.
	 * @param {Object} options - The plugin options, including services.
	 * @param {StorageService} options.storageService - The service for handling file storage.
	 * @param {AlbumsService} options.albumsService - The service for albums.
	 * @param {UploadsValidator} options.validator - The validator for uploads.
	 */
	register: async (server, { storageService, albumsService, validator }) => {
		const uploadsHandler = new UploadsHandler(storageService, albumsService, validator);

		// Register routes with the Hapi.js server
		server.route(routes(uploadsHandler));
	},
};
