const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

/**
 * UserAlbumLikesService is a service class that handles user album likes data.
 *
 * @class
 */
class UserAlbumLikesService {
	/**
	 * Creates an instance of UserAlbumLikesService.
	 *
	 * @constructor
	 * @param {CacheService} cacheService - The cache service to use for caching album likes.
	 */
	constructor(cacheService) {
		this._pool = new Pool();
		this._cacheService = cacheService;
	}

	/**
	 * Adds a user's like for an album to the database.
	 *
	 * @param {string} userId - The ID of the user liking the album.
	 * @param {string} albumId - The ID of the album being liked.
	 * @throws {ClientError} If the user has already liked the album.
	 * @throws {InvariantError} If adding the like fails.
	 * @async
	 */
	async likeAlbum(userId, albumId) {
		const id = `user-album-like${nanoid(16)}`;

		const alreadyLike = await this.verifyAlbumLike(userId, albumId);
		if (alreadyLike) {
			throw new ClientError('Album sudah dilike sebelumnya');
		}

		const query = {
			text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3)',
			values: [id, userId, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError('User gagal like album');
		}

		await this._cacheService.delete(`album-like:${albumId}`);
	}

	/**
	 * Removes a user's like for an album from the database.
	 *
	 * @param {string} userId - The ID of the user unliking the album.
	 * @param {string} albumId - The ID of the album being unliked.
	 * @throws {ClientError} If the user has not previously liked the album.
	 * @throws {NotFoundError} If removing the like fails.
	 * @async
	 */
	async unlikeAlbum(userId, albumId) {
		const alreadyLike = await this.verifyAlbumLike(userId, albumId);
		if (!alreadyLike) {
			throw new ClientError('Album belum dilike sebelumnya');
		}

		const query = {
			text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
			values: [userId, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('User gagal unlike album');
		}

		await this._cacheService.delete(`album-like:${albumId}`);
	}

	/**
	 * Retrieves the total number of likes for an album.
	 *
	 * @param {string} albumId - The ID of the album.
	 * @returns {Object} An object containing the number of likes and the source (cache or database).
	 * @async
	 */
	async getAlbumLikes(albumId) {
		try {
			const result = await this._cacheService.get(`album-like:${albumId}`);
			return {
				likes: JSON.parse(result),
				from: 'cache',
			};
		} catch {
			const query = {
				text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
				values: [albumId],
			};

			const result = await this._pool.query(query);

			await this._cacheService.set(`album-like:${albumId}`, JSON.stringify(result.rowCount), 1800);
			return {
				likes: result.rowCount,
			};
		}
	}

	/**
	 * Verifies if a user has liked a specific album.
	 *
	 * @param {string} userId - The ID of the user.
	 * @param {string} albumId - The ID of the album.
	 * @returns {boolean} `true` if the user has liked the album, `false` otherwise.
	 * @async
	 */
	async verifyAlbumLike(userId, albumId) {
		const query = {
			text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
			values: [userId, albumId],
		};

		const result = await this._pool.query(query);
		const like = result.rowCount;

		return like;
	}
}

module.exports = UserAlbumLikesService;
