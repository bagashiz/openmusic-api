/**
 * Generates route configuration objects for likes-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/albums/{id}/likes',
		handler: (request, h) => handler.postUserAlbumLikeHandler(request, h),
		options: {
			auth: 'openmusic_jwt',
		},
	},
	{
		method: 'GET',
		path: '/albums/{id}/likes',
		handler: (request, h) => handler.getUserAlbumLikeHandler(request, h),
	},
	{
		method: 'DELETE',
		path: '/albums/{id}/likes',
		handler: (request, h) => handler.deleteUserAlbumLikeHandler(request, h),
		options: {
			auth: 'openmusic_jwt',
		},
	},
];

module.exports = routes;
