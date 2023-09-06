/* eslint-disable camelcase */

/**
 * mapDBToAlbumModel is a function that will be used to
 * map the album data from database to the album model
 */
// eslint-disable-next-line object-curly-newline
const mapDBToAlbumModel = ({ id, name, year, cover_url, created_at, updated_at }) => ({
    id,
    name,
    year,
    coverUrl: cover_url,
    createdAt: created_at,
    updatedAt: updated_at,
});

/**
 * mapDBToSongModel is a function that will be used to
 * map the song data from database to the song model
 */
// eslint-disable-next-line object-curly-newline, max-len
const mapDBToSongModel = ({ id, title, year, performer, genre, duration, created_at, updated_at }) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    createdAt: created_at,
    updatedAt: updated_at,
});
module.exports = { mapDBToAlbumModel, mapDBToSongModel };
