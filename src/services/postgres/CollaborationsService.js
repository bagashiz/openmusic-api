const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * CollaborationsService is a service that handles the collaboration between users
 *
 * @class
 */
class CollaborationsService {
	/**
	 * Creates an instance of CollaborationsService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds a collaboration between users for a playlist.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} userId - The ID of the user to collaborate with.
	 * @returns {string} The ID of the added collaboration.
	 * @throws {InvariantError} If adding the collaboration fails.
	 * @async
	 */
	async addCollaboration(playlistId, userId) {
		const id = `collaboration-${nanoid(16)}`;
		const query = {
			text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
			values: [id, playlistId, userId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Gagal menambahkan kolaborasi');
		}

		return result.rows[0].id;
	}

	/**
	 * Deletes a collaboration between a user and a playlist.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} userId - The ID of the user to remove from the collaboration.
	 * @throws {InvariantError} If deleting the collaboration fails.
	 * @async
	 */
	async deleteCollaboration(playlistId, userId) {
		const query = {
			text: `DELETE FROM collaborations 
        WHERE playlist_id = $1 AND user_id = $2
        RETURNING id`,
			values: [playlistId, userId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Gagal menghapus kolaborasi');
		}
	}

	/**
	 * Verifies if a user is a collaborator for a playlist.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} userId - The ID of the user to verify as a collaborator.
	 * @throws {InvariantError} If the user is not a collaborator for the playlist.
	 * @async
	 */
	async verifyCollaborator(playlistId, userId) {
		const query = {
			text: `SELECT * FROM collaborations 
        WHERE user_id = $1 AND playlist_id = $2`,
			values: [userId, playlistId],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Tidak memiliki kolaborasi');
		}
	}
}

module.exports = CollaborationsService;
