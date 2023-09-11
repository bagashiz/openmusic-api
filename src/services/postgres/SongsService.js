const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToSongModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * SongsService is a class that will be used to handle all CRUD operations on songs data.
 *
 * @class
 */
class SongsService {
	/**
	 * Creates an instance of SongsService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds a song to the database.
	 *
	 * @param {Object} songData - The song data to add.
	 * @param {string} songData.title - The title of the song.
	 * @param {number} songData.year - The year of the song.
	 * @param {string} songData.genre - The genre of the song.
	 * @param {string} songData.performer - The performer of the song.
	 * @param {number} songData.duration - The duration of the song (optional).
	 * @param {string} songData.albumId - The ID of the album associated with the song.
	 * @returns {string} The ID of the added song.
	 * @throws {InvariantError} If adding the song fails.
	 * @async
	 */
	async addSong({ title, year, genre, performer, duration, albumId }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
			values: [id, title, year, genre, performer, duration, createdAt, updatedAt, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError('Lagu gagal ditambahkan');
		}

		return result.rows[0].id;
	}

	/**
	 * Retrieves songs based on title and performer filters.
	 *
	 * @param {string} title - The title filter (optional).
	 * @param {string} performer - The performer filter (optional).
	 * @returns {Object[]} An array of song models that match the filters.
	 * @async
	 */
	async getSongs(title, performer) {
		let query = '';
		if (title && performer) {
			query = {
				text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2',
				values: [`%${title.toLowerCase()}%`, `%${performer.toLowerCase()}%`],
			};
		} else if (title) {
			query = {
				text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1',
				values: [`%${title.toLowerCase()}%`],
			};
		} else if (performer) {
			query = {
				text: 'SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1',
				values: [`%${performer.toLowerCase()}%`],
			};
		} else {
			query = 'SELECT id, title, performer FROM songs';
		}

		const result = await this._pool.query(query);
		return result.rows.map(mapDBToSongModel);
	}

	/**
	 * Retrieves a song by its ID.
	 *
	 * @param {string} id - The ID of the song.
	 * @returns {Object} The song model.
	 * @throws {NotFoundError} If the song is not found.
	 * @async
	 */
	async getSongById(id) {
		const query = {
			text: 'SELECT * FROM songs WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Lagu tidak ditemukan');
		}

		return result.rows.map(mapDBToSongModel)[0];
	}

	/**
	 * Edits a song by its ID.
	 *
	 * @param {string} id - The ID of the song to edit.
	 * @param {Object} songData - The updated song data.
	 * @throws {NotFoundError} If the song ID is not found.
	 * @async
	 */
	async editSongById(id, { title, year, performer, genre, duration }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
			values: [title, year, performer, genre, duration, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
		}
	}

	/**
	 * Deletes a song by its ID.
	 *
	 * @param {string} id - The ID of the song to delete.
	 * @throws {NotFoundError} If the song ID is not found.
	 * @async
	 */
	async deleteSongById(id) {
		const query = {
			text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
		}
	}

	/**
	 * Verifies the existence of a song by its ID.
	 *
	 * @param {string} id - The ID of the song to verify.
	 * @throws {NotFoundError} If the song is not found.
	 * @async
	 */
	async verifySong(id) {
		const query = {
			text: 'SELECT * FROM songs WHERE id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError('Lagu tidak valid');
		}
	}
}

module.exports = SongsService;
