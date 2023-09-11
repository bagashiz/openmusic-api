const autoBind = require('auto-bind');

/**
 * AlbumsHandler is a class that handles HTTP requests related to albums.
 *
 * @class
 */
class AlbumsHandler {
	/**
	 * Creates an instance of AlbumsHandler.
	 *
	 * @constructor
	 * @param {AlbumsService} service - The service for handling albums.
	 * @param {AlbumsValidator} validator - The validator for albums.
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the POST request to add an album.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postAlbumHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);
		const { name, year } = request.payload;

		const albumId = await this._service.addAlbum({ name, year });

		const response = h.response({
			status: 'success',
			message: 'Album berhasil ditambahkan',
			data: {
				albumId,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the GET request to get all albums.
	 *
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async getAlbumsHandler() {
		const albums = await this._service.getAlbums();
		return {
			status: 'success',
			data: {
				albums,
			},
		};
	}

	/**
	 * Handles the GET request to get an album by ID.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async getAlbumByIdHandler(request) {
		const { id } = request.params;
		const album = await this._service.getAlbumById(id);
		return {
			status: 'success',
			data: {
				album,
			},
		};
	}

	/**
	 * Handles the PUT request to edit an album by ID.
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async putAlbumByIdHandler(request) {
		this._validator.validateAlbumPayload(request.payload);
		const { id } = request.params;

		await this._service.editAlbumById(id, request.payload);

		return {
			status: 'success',
			message: 'Album berhasil diperbarui',
		};
	}

	/**
	 * Handles the DELETE request to delete an album by ID.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async deleteAlbumByIdHandler(request) {
		const { id } = request.params;
		await this._service.deleteAlbumById(id);

		return {
			status: 'success',
			message: 'Album berhasil dihapus',
		};
	}
}

module.exports = AlbumsHandler;
