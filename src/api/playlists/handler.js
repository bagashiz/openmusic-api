const autoBind = require('auto-bind');

/**
 * PlaylistsHandler is a class that handles playlist routes.
 *
 * @class
 */
class PlaylistsHandler {
	/**
	 * Creates an instance of PlaylistsHandler.
	 *
	 * @constructor
	 * @param {PlaylistsService} playlistsService - The service for handling playlists.
	 * @param {SongsService} songsService - The service for handling songs.
	 * @param {ActivitiesService} activitiesService - The service for handling activities.
	 * @param {TokenManager} tokenManager - The token manager service.
	 * @param {PlaylistsValidator} validator - The validator for playlists.
	 */
	constructor(playlistsService, songsService, activitiesService, tokenManager, validator) {
		this._playlistsService = playlistsService;
		this._activitiesService = activitiesService;
		this._songsService = songsService;
		this._tokenManager = tokenManager;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the HTTP POST request to create a new playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postPlaylistHandler(request, h) {
		this._validator.validatePlaylistPayload(request.payload);
		const { name: playlist } = request.payload;
		const { id: credentialId } = request.auth.credentials;
		const playlistId = await this._playlistsService.addPlaylist(playlist, credentialId);
		const response = h.response({
			status: 'success',
			message: 'Berhasil membuat playlist',
			data: {
				playlistId,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the HTTP GET request to retrieve playlists.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {Object} The HTTP response.
	 * @async
	 */
	async getPlaylistHandler(request) {
		const { id: credentialId } = request.auth.credentials;
		const playlists = await this._playlistsService.getPlaylists(credentialId);
		return {
			status: 'success',
			data: {
				playlists,
			},
		};
	}

	/**
	 * Handles the HTTP DELETE request to delete a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {Object} The HTTP response.
	 * @async
	 */
	async deletePlaylistHandler(request) {
		const { id: credentialId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
		await this._playlistsService.deletePlaylist(playlistId);
		return {
			status: 'success',
			message: 'Berhasil manghapus playlists',
		};
	}

	/**
	 * Handles the HTTP POST request to add a song to a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postPlaylistSongHandler(request, h) {
		this._validator.validatePlaylistSongPayload(request.payload);
		const { songId } = request.payload;
		await this._songsService.verifySong(songId);

		const { id: credentialId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

		const playlistSongId = await this._playlistsService.addPlaylistSong(playlistId, songId);
		await this._activitiesService.addActivities(playlistId, songId, credentialId, 'add');
		const response = h.response({
			status: 'success',
			message: 'Berhasil menambahkan lagu pada playlist',
			data: {
				playlistSongId,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the HTTP GET request to retrieve songs from a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {Object} The HTTP response.
	 * @async
	 */
	async getPlaylistSongHandler(request) {
		const { id: credentialId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
		const playlist = await this._playlistsService.getPlaylistById(playlistId, credentialId);
		const songs = await this._playlistsService.getPlaylistSong(playlistId);
		playlist.songs = songs;
		return {
			status: 'success',
			data: {
				playlist,
			},
		};
	}

	/**
	 * Handles the HTTP DELETE request to remove a song from a playlist.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {Object} The HTTP response.
	 * @async
	 */
	async deletePlaylistSongHandler(request) {
		const { id: credentialId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		const { songId } = request.payload;
		await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

		await this._playlistsService.deletePlaylistSong(songId);

		await this._activitiesService.addActivities(playlistId, songId, credentialId, 'delete');
		return {
			status: 'success',
			message: 'Berhasil menghapus lagu dari playlist',
		};
	}

	/**
	 * Handles the HTTP GET request to retrieve playlist activities.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {Object} The HTTP response.
	 * @async
	 */
	async getPlaylistActivitiesHandler(request) {
		const { id: credentialId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

		const activities = await this._activitiesService.getActivities(playlistId);
		return {
			status: 'success',
			data: {
				playlistId,
				activities,
			},
		};
	}
}

module.exports = PlaylistsHandler;
