const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * ActivitiesService is a service that handles activities related to playlists and songs.
 *
 * @class
 */
class ActivitiesService {
	/**
	 * Creates an instance of ActivitiesService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds an activity related to a playlist and song to the database.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @param {string} songId - The ID of the song.
	 * @param {string} userId - The ID of the user performing the action.
	 * @param {string} action - The type of action (e.g., 'add', 'delete').
	 * @returns {string} The ID of the added activity.
	 * @throws {InvariantError} If adding the activity fails.
	 * @async
	 */
	async addActivities(playlistId, songId, userId, action) {
		const id = `activity-${nanoid(16)}`;
		const query = {
			text: `INSERT INTO playlist_song_activities 
        VALUES($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id`,
			values: [id, playlistId, songId, userId, action],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError('Aktivitas gagal ditambahkan');
		}

		return result.rows[0].id;
	}

	/**
	 * Retrieves all activities related to a playlist from the database.
	 *
	 * @param {string} playlistId - The ID of the playlist.
	 * @returns {Object[]} An array of activity objects.
	 * @async
	 */
	async getActivities(playlistId) {
		const query = {
			text: `SELECT users.username, songs.title,
      playlist_song_activities.action,
      playlist_song_activities.time
          FROM playlist_song_activities
          JOIN playlists
          ON playlist_song_activities.playlist_id = playlists.id
          JOIN users
          ON playlists.owner = users.id
          JOIN songs
          ON playlist_song_activities.song_id = songs.id
          WHERE playlists.id = $1`,
			values: [playlistId],
		};

		const result = await this._pool.query(query);
		return result.rows;
	}
}

module.exports = ActivitiesService;
