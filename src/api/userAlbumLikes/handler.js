const autoBind = require('auto-bind');

/**
 * UserAlbumLikesHandler is a class that handles all HTTP requests related to user album likes.
 *
 * @class
 */
class UserAlbumLikesHandler {
	/**
	 * Creates an instance of UserAlbumLikesHandler.
	 *
	 * @constructor
	 * @param {UserAlbumLikesService} userAlbumLikesService - The service for user album likes.
	 * @param {AlbumsService} albumsService - The service for albums.
	 */
	constructor(userAlbumLikesService, albumsService) {
		this._userAlbumLikesService = userAlbumLikesService;
		this._albumsService = albumsService;

		autoBind(this);
	}

	/**
	 * Handles POST HTTP requests to like/unlike an album.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postUserAlbumLikeHandler(request, h) {
		const { id: credentialId } = request.auth.credentials;
		const { id: albumId } = request.params;

		await this._albumsService.getAlbumById(albumId);

		await this._userAlbumLikesService.likeAlbum(credentialId, albumId);

		const response = h.response({
			status: 'success',
			message: 'Berhasil like albums',
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles GET HTTP requests to get the sum of user likes for an album.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async getUserAlbumLikeHandler(request, h) {
		const { id } = request.params;

		await this._albumsService.getAlbumById(id);

		const { likes, from } = await this._userAlbumLikesService.getAlbumLikes(id);

		if (from === 'cache') {
			const response = h.response({
				status: 'success',
				data: {
					likes,
				},
			});
			response.code(200);
			response.header('X-Data-Source', from);
			return response;
		}

		const response = h.response({
			status: 'success',
			data: {
				likes,
			},
		});
		response.code(200);
		return response;
	}

	/**
	 * Handles DELETE HTTP requests to unlike an album.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async deleteUserAlbumLikeHandler(request, h) {
		const { id: credentialId } = request.auth.credentials;
		const { id: albumId } = request.params;

		await this._albumsService.getAlbumById(albumId);

		await this._userAlbumLikesService.unlikeAlbum(credentialId, albumId);

		const response = h.response({
			status: 'success',
			message: 'Berhasil unlike albums',
		});
		response.code(200);
		return response;
	}
}

module.exports = UserAlbumLikesHandler;
