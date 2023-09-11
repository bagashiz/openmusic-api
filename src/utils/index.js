/**
 * mapDBToAlbumModel is a function that will be used to
 * map the album data from the database to the album model.
 *
 * @param {Object} {
 *   id,
 *   name,
 *   year,
 *   cover_url,
 *   created_at,
 *   updated_at
 * } - Album data from the database.
 * @returns {Object} {
 *   id,
 *   name,
 *   year,
 *   coverUrl,
 *   createdAt,
 *   updatedAt
 * } - Album model.
 */
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
 * map the song data from the database to the song model.
 *
 * @param {Object} {
 *   id,
 *   title,
 *   year,
 *   performer,
 *   genre,
 *   duration,
 *   created_at,
 *   updated_at
 * } - Song data from the database.
 * @returns {Object} {
 *   id,
 *   title,
 *   year,
 *   performer,
 *   genre,
 *   duration,
 *   createdAt,
 *   updatedAt
 * } - Song model.
 */
const mapDBToSongModel = ({
	id,
	title,
	year,
	performer,
	genre,
	duration,
	created_at,
	updated_at,
}) => ({
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
