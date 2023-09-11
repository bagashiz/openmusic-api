const Joi = require('joi');

/**
 * Generates route configuration objects for song-related endpoints.
 *
 * @param {Object} handler - The request handler object with specific methods.
 * @returns {Object[]} An array of route configuration objects.
 */
const routes = (handler) => [
	{
		method: 'POST',
		path: '/songs',
		handler: handler.postSongHandler,
	},
	{
		method: 'GET',
		path: '/songs',
		handler: handler.getSongsHandler,
		options: {
			validate: {
				query: Joi.object({
					title: Joi.string(),
					performer: Joi.string(),
				}),
			},
		},
	},
	{
		method: 'GET',
		path: '/songs/{id}',
		handler: handler.getSongByIdHandler,
	},
	{
		method: 'PUT',
		path: '/songs/{id}',
		handler: handler.putSongByIdHandler,
	},
	{
		method: 'DELETE',
		path: '/songs/{id}',
		handler: handler.deleteSongByIdHandler,
	},
];

module.exports = routes;
