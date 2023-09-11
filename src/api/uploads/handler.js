const autoBind = require('auto-bind');

/**
 * UploadsHandler is a class that handles uploads.
 *
 * @class
 */
class UploadsHandler {
	/**
	 * Creates an instance of UploadsHandler.
	 *
	 * @constructor
	 * @param {StorageService} storageService - The service for handling file uploads.
	 * @param {AlbumsService} albumsService - The service for handling albums.
	 * @param {UploadsValidator} validator - The validator for validating file headers.
	 */
	constructor(storageService, albumsService, validator) {
		this._storageService = storageService;
		this._albumsService = albumsService;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the POST request to upload an album cover.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postUploadAlbumCoverHandler(request, h) {
		const { id } = request.params;
		const { cover } = request.payload;
		this._validator.validateImageHeaders(cover.hapi.headers);

		const filename = await this._storageService.writeFile(cover, cover.hapi);
		const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/cover/${filename}`;

		await this._albumsService.editAlbumCover(id, coverUrl);

		const response = h.response({
			status: 'success',
			message: 'Sampul berhasil diunggah',
		});
		response.code(201);
		return response;
	}
}

module.exports = UploadsHandler;
