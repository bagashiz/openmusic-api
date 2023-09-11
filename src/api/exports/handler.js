const autoBind = require('auto-bind');

/**
 * ExportsHandler is a class that handles export routes.
 *
 * @class
 */
class ExportsHandler {
	/**
	 * Creates an instance of ExportsHandler.
	 *
	 * @constructor
	 * @param {ProducerService} producerService - The service for producing messages.
	 * @param {PlaylistsService} playlistsService - The service for handling playlists.
	 * @param {ExportsValidator} validator - The validator for exports.
	 */
	constructor(producerService, playlistsService, validator) {
		this._producerService = producerService;
		this._playlistsService = playlistsService;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the HTTP POST request to export songs from a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postExportSongsHandler(request, h) {
		this._validator.validateExportSongsPayload(request.payload);

		const { id: credentialId } = request.auth.credentials;
		const { playlistId } = request.params;

		await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

		const message = {
			playlistId,
			targetEmail: request.payload.targetEmail,
		};

		await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

		const response = h.response({
			status: 'success',
			message: 'Permintaan Anda sedang kami proses',
		});
		response.code(201);
		return response;
	}
}

module.exports = ExportsHandler;
