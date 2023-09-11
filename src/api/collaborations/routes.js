/**
 * Generates route configuration objects for collaboration-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/collaborations',
		handler: handler.postCollaborationHandler,
		options: {
			auth: 'openmusic_jwt',
		},
	},
	{
		method: 'DELETE',
		path: '/collaborations',
		handler: handler.deleteCollaborationHandler,
		options: {
			auth: 'openmusic_jwt',
		},
	},
];

module.exports = routes;
