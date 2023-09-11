const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToAlbumModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * AlbumsService is a class that will be used to handle all of the CRUD operations on albums data
 *
 * @class
 */
class AlbumsService {
	/**
	 * Creates an instance of AlbumsService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds an album to the database.
	 *
	 * @param {Object} albumData - The album data including name and year.
	 * @param {string} albumData.name - The name of the album.
	 * @param {number} albumData.year - The year of the album.
	 * @returns {string} The ID of the added album.
	 * @throws {InvariantError} If adding the album fails.
	 * @async
	 */
	async addAlbum({ name, year }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: 'INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
			values: [id, name, year, createdAt, updatedAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError('Album gagal ditambahkan');
		}

		return result.rows[0].id;
	}

	/**
	 * Retrieves all albums from the database.
	 *
	 * @returns {Object[]} An array of album objects.
	 * @async
	 */
	async getAlbums() {
		const result = await this._pool.query('SELECT * FROM albums');
		return result.rows.map(mapDBToAlbumModel);
	}

	/**
	 * Retrieves an album by its ID from the database.
	 *
	 * @param {string} id - The ID of the album to retrieve.
	 * @returns {Object} The album object.
	 * @throws {NotFoundError} If the album is not found.
	 * @async
	 */
	async getAlbumById(id) {
		const query = {
			text: 'SELECT * FROM albums WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Album tidak ditemukan');
		}

		const songs = await this._pool.query({
			text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
			values: [id],
		});

		return {
			...result.rows.map(mapDBToAlbumModel)[0],
			songs: songs.rows,
		};
	}

	/**
	 * Edits an album by its ID in the database.
	 *
	 * @param {string} id - The ID of the album to edit.
	 * @param {Object} albumData - The album data to update.
	 * @param {string} albumData.name - The updated name of the album.
	 * @param {number} albumData.year - The updated year of the album.
	 * @throws {NotFoundError} If the album is not found.
	 * @async
	 */
	async editAlbumById(id, { name, year }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
			values: [name, year, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
		}
	}

	/**
	 * Edits the cover of an album by its ID in the database.
	 *
	 * @param {string} id - The ID of the album to edit.
	 * @param {string} coverUrl - The URL of the updated album cover.
	 * @throws {NotFoundError} If the album is not found.
	 * @async
	 */
	async editAlbumCover(id, coverUrl) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
			values: [coverUrl, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan');
		}
	}

	/**
	 * Deletes an album by its ID from the database.
	 *
	 * @param {string} id - The ID of the album to delete.
	 * @throws {NotFoundError} If the album is not found.
	 * @async
	 */
	async deleteAlbumById(id) {
		const query = {
			text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
		}
	}
}

module.exports = AlbumsService;
