/* eslint-disable camelcase */

/**
 * mapDBToModel is a function that will be used to map the data from database to the model
 */
// eslint-disable-next-line object-curly-newline
const mapDBToAlbumModel = ({ id, name, year, created_at, updated_at }) => ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
});

module.exports = { mapDBToAlbumModel };
