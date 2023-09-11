/**
 * Generates route configuration objects for user-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/users',
		handler: handler.postUserHandler,
	},
	{
		method: 'GET',
		path: '/users/{id}',
		handler: handler.getUserByIdHandler,
	},
	{
		method: 'GET',
		path: '/users',
		handler: handler.getUsersByUsernameHandler,
	},
];

module.exports = routes;
