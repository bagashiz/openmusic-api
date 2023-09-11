/**
 * Generates route configuration objects for album-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/albums',
		handler: handler.postAlbumHandler,
	},
	{
		method: 'GET',
		path: '/albums',
		handler: handler.getAlbumsHandler,
	},
	{
		method: 'GET',
		path: '/albums/{id}',
		handler: handler.getAlbumByIdHandler,
	},
	{
		method: 'PUT',
		path: '/albums/{id}',
		handler: handler.putAlbumByIdHandler,
	},
	{
		method: 'DELETE',
		path: '/albums/{id}',
		handler: handler.deleteAlbumByIdHandler,
	},
];

module.exports = routes;
