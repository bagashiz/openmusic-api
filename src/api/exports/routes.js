/**
 * Generates route configuration objects for export-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/export/playlists/{playlistId}',
		handler: handler.postExportSongsHandler,
		options: {
			auth: 'openmusic_jwt',
		},
	},
];

module.exports = routes;
