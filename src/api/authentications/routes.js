/**
 * Generates route configuration objects for authentication-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/authentications',
		handler: handler.postAuthenticationHandler,
	},
	{
		method: 'PUT',
		path: '/authentications',
		handler: handler.putAuthenticationHandler,
	},
	{
		method: 'DELETE',
		path: '/authentications',
		handler: handler.deleteAuthenticationHandler,
	},
];

module.exports = routes;
