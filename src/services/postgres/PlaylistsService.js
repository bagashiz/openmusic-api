const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * PlaylistsService is a service that handle playlists data
 */
class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
    }

    /**
     * addPlaylist is a function to add playlist to database
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
     * getPlaylists is a function to get all playlists from database
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
     * getPlaylistById is a function to get playlist by id from database
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
     * editPlaylistById is a function to edit playlist by id from database
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
     * addPlaylistSong is a function to add playlist song to database
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
     * getPlaylistSong is a function to get playlist song from database
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
     * deletePlaylistSong is a function to delete playlist song from database
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
     * verifyPlaylistOwner is a function to verify playlist owner from database
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
     * verifyPlaylistAccess is a function to verify playlist access from database
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
     * verifyPlaylist is a function to verify playlist from database
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
