const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * PlaylistsService is a service that handles playlists data.
 *
 * @class
 */
class PlaylistsService {
	/**
	 * Creates an instance of PlaylistsService.
	 *
	 * @constructor
	 * @param {CollaborationsService} collaborationsService - The collaborations service to use for verifying playlist access.
	 */
	constructor(collaborationsService) {
		this._pool = new Pool();
		this._collaborationsService = collaborationsService;
	}

	/**
	 * Adds a playlist to the database.
	 *
	 * @param {string} playlist - The name of the playlist.
	 * @param {string} owner - The owner's user ID.
	 * @returns {string} The ID of the added playlist.
	 * @throws {InvariantError} If adding the playlist fails.
	 * @async
	 */
	async addPlaylist(playlist, owner) {
		const id = `playlist-${nanoid(16)}`;
		const query = {
			text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
			values: [id, playlist, owner],
		};
		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError('Gagal menambahkan playlist');
		}

		return result.rows[0].id;
	}

	/**
	 * Retrieves playlists for a user.
	 *
	 * @param {string} userId - The user's ID.
	 * @returns {Object[]} An array of playlist objects.
	 * @async
	 */
	async getPlaylists(userId) {
		const query = {
			text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN users
        ON users.id = playlists.owner
        FULL JOIN collaborations
        ON playlists.id = collaborations.playlist_id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
			values: [userId],
		};
		const result = await this._pool.query(query);
		return result.rows;
	}

	/**
	 * Retrieves a playlist by its ID from the database.
	 *
	 * @param {string} playlistId - The ID of the playlist to retrieve.
	 * @returns {Object} The playlist object.
	 * @throws {NotFoundError} If the playlist is not found.
	 * @async
	 */
	async getPlaylistById(playlistId) {
		const query = {
			text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists
      JOIN users
      ON playlists.owner = users.id 
      WHERE playlists.id = $1`,
			values: [playlistId],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError('Playlist tidak ditemukan');
		}
		return result.rows[0];
	}

	/**
	 * Deletes a playlist by its ID from the database.
	 *
	 * @param {string} playlistId - The ID of the playlist to delete.
	 * @throws {InvariantError|NotFoundError} If deleting the playlist fails or the playlist is not found.
	 * @async
	 */
	async deletePlaylist(playlistId) {
		const query = {
			text: 'DELETE FROM playlists WHERE id = $1',
			values: [playlistId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Gagal menghapus playlist');
		}
	}

	/**
	 * Adds a song to a playlist in the database.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} songId - The ID of the song to add to the playlist.
	 * @throws {InvariantError} If adding the song to the playlist fails.
	 * @async
	 */
	async addPlaylistSong(playlistId, songId) {
		const id = `playlist_song-${nanoid(16)}`;
		const query = {
			text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
			values: [id, playlistId, songId],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Gagal menambahkan playlist song');
		}
		return result.rows[0].id;
	}

	/**
	 * Retrieves songs in a playlist from the database.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @returns {Object[]} An array of song objects in the playlist.
	 * @async
	 */
	async getPlaylistSong(playlistId) {
		const query = {
			text: `SELECT songs.id, 
      songs.title, 
      songs.performer 
        FROM playlist_songs
        JOIN songs
        ON playlist_songs.song_id = songs.id 
        WHERE playlist_songs.playlist_id = $1`,
			values: [playlistId],
		};

		const result = await this._pool.query(query);

		return result.rows;
	}

	/**
	 * Deletes a song from a playlist in the database.
	 *
	 * @param {string} songId - The ID of the song to remove from the playlist.
	 * @throws {InvariantError|NotFoundError} If removing the song from the playlist fails or the playlist is not found.
	 * @async
	 */
	async deletePlaylistSong(songId) {
		const query = {
			text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
			values: [songId],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Gagal menghapus playlist song');
		}
	}

	/**
	 * Verifies that the user is the owner of a playlist.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} ownerId - The ID of the owner to verify.
	 * @throws {AuthorizationError|NotFoundError} If the user is not the owner of the playlist or the playlist is not found.
	 * @async
	 */
	async verifyPlaylistOwner(playlistId, ownerId) {
		await this.verifyPlaylist(playlistId);

		const query = {
			text: 'SELECT * FROM playlists WHERE id = $1',
			values: [playlistId],
		};

		const result = await this._pool.query(query);

		const { owner } = result.rows[0];
		if (owner !== ownerId) {
			throw new AuthorizationError('Anda tidak memiliki akses');
		}
	}

	/**
	 * Verifies playlist access for a user.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} ownerId - The ID of the owner to verify.
	 * @throws {AuthorizationError|NotFoundError} If the user does not have access to the playlist.
	 * @async
	 */
	async verifyPlaylistAccess(playlistId, ownerId) {
		try {
			await this.verifyPlaylistOwner(playlistId, ownerId);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}
			try {
				await this._collaborationsService.verifyCollaborator(playlistId, ownerId);
			} catch {
				throw error;
			}
		}
	}

	/**
	 * Verifies the existence of a playlist.
	 *
	 * @param {string} playlistId - The ID of the playlist to verify.
	 * @throws {NotFoundError} If the playlist is not found.
	 * @async
	 */
	async verifyPlaylist(playlistId) {
		const query = {
			text: 'SELECT * FROM playlists WHERE id = $1',
			values: [playlistId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError('Playlist tidak ditemukan');
		}
	}
}

module.exports = PlaylistsService;
