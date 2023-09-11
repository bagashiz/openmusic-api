const autoBind = require('auto-bind');

/**
 * CollaborationHandler is a class that handles routes related to collaborations.
 *
 * @class
 */
class CollaborationHandler {
	/**
	 * Creates an instance of CollaborationHandler.
	 *
	 * @constructor
	 * @param {CollaborationsService} collaborationsService - The service for handling collaborations.
	 * @param {UsersService} usersService - The service for handling users.
	 * @param {PlaylistsService} playlistsService - The service for handling playlists.
	 * @param {CollaborationsValidator} validator - The validator for collaborations.
	 */
	constructor(collaborationsService, usersService, playlistsService, validator) {
		this._collaborationsService = collaborationsService;
		this._usersService = usersService;
		this._playlistsService = playlistsService;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the HTTP POST request to add a collaboration to a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postCollaborationHandler(request, h) {
		this._validator.validateCollaborationPayload(request.payload);
		const { playlistId, userId } = request.payload;
		const { id: credentialId } = request.auth.credentials;
		await this._usersService.verifyUser(userId);
		await this._playlistsService.verifyPlaylist(playlistId);
		await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

		const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);
		const response = h.response({
			status: 'success',
			message: 'Berhasil menambahkan collaboration',
			data: {
				collaborationId,
			},
		});

		response.code(201);
		return response;
	}

	/**
	 * Handles the HTTP DELETE request to delete a collaboration from a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async deleteCollaborationHandler(request) {
		this._validator.validateCollaborationPayload(request.payload);
		const { playlistId, userId } = request.payload;
		const { id: credentialId } = request.auth.credentials;
		await this._usersService.verifyUser(userId);
		await this._playlistsService.verifyPlaylist(playlistId);
		await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

		await this._collaborationsService.deleteCollaboration(playlistId, userId);
		return {
			status: 'success',
			message: 'Berhasil menghapus collaboration',
		};
	}
}

module.exports = CollaborationHandler;
