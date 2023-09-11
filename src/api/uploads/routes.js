const path = require('path');

/**
 * Generates route configuration objects for upload-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/albums/{id}/covers',
		handler: handler.postUploadAlbumCoverHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true,
				output: 'stream',
				maxBytes: 512 * 1000, // 512 kB
			},
		},
	},
	{
		method: 'GET',
		path: '/albums/{id}/cover/{param*}',
		handler: {
			directory: {
				path: path.resolve(__dirname, 'file/covers'),
			},
		},
	},
];

module.exports = routes;
