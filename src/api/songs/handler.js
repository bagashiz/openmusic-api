const autoBind = require('auto-bind');

/**
 * SongsHandler is a class that will be used to handle all of the routes.
 *
 * @class
 */
class SongsHandler {
	/**
	 * Creates an instance of SongsHandler.
	 *
	 * @constructor
	 * @param {SongsService} service - The service for songs.
	 * @param {SongsValidator} validator - The validator for songs.
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the POST request to add a song.
	 *
	 * @param {request} request - the hapi.js request object.
	 * @param {responsetoolkit} h - the hapi.js response toolkit.
	 * @returns {responseobject} the http response.
	 * @async
	 */
	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const { title, year, genre, performer, duration, albumId } = request.payload;

		const songId = await this._service.addSong({
			title,
			year,
			genre,
			performer,
			duration,
			albumId,
		});

		const response = h.response({
			status: 'success',
			message: 'Lagu berhasil ditambahkan',
			data: {
				songId,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the GET request to get a song by ID.
	 *
	 * @param {request} request - the hapi.js request object.
	 * @returns {responseobject} the http response.
	 * @async
	 */
	async getSongsHandler(request) {
		const { title, performer } = request.query;
		const songs = await this._service.getSongs(title, performer);

		return {
			status: 'success',
			data: {
				songs: songs.map((song) => ({
					id: song.id,
					title: song.title,
					performer: song.performer,
				})),
			},
		};
	}

	/**
	 * Handles the GET request to get a song by ID.
	 *
	 * @param {request} request - the hapi.js request object.
	 * @returns {responseobject} the http response.
	 * @async
	 */
	async getSongByIdHandler(request) {
		const { id } = request.params;
		const song = await this._service.getSongById(id);
		return {
			status: 'success',
			data: {
				song,
			},
		};
	}

	/**
	 * Handles the PUT request to edit a song by ID.
	 *
	 * @param {request} request - the hapi.js request object.
	 * @returns {responseobject} the http response.
	 * @async
	 */
	async putSongByIdHandler(request) {
		this._validator.validateSongPayload(request.payload);
		const { id } = request.params;

		await this._service.editSongById(id, request.payload);

		return {
			status: 'success',
			message: 'Lagu berhasil diperbarui',
		};
	}

	/**
	 * Handles the DELETE request to delete a song by ID.
	 *
	 * @param {request} request - the hapi.js request object.
	 * @returns {responseobject} the http response.
	 * @async
	 */
	async deleteSongByIdHandler(request) {
		const { id } = request.params;
		await this._service.deleteSongById(id);

		return {
			status: 'success',
			message: 'Lagu berhasil dihapus',
		};
	}
}

module.exports = SongsHandler;
