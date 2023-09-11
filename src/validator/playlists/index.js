const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema');

/**
 * PlaylistValidator is a utility class for handling playlist-related payload validations.
 * @namespace
 */
const PlaylistValidator = {
	/**
	 * Validates a playlist payload using the specified schema.
	 *
	 * @param {Object} payload - The playlist payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validatePlaylistPayload: (payload) => {
		const validationResult = PlaylistPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},

	/**
	 * Validates a playlist song payload using the specified schema.
	 *
	 * @param {Object} payload - The playlist song payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validatePlaylistSongPayload: (payload) => {
		const validationResult = PlaylistSongPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = PlaylistValidator;
