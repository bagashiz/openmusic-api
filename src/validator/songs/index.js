const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

/**
 * SongsValidator is a utility class for validating song-related payloads.
 *
 * @namespace
 */
const SongsValidator = {
	/**
	 * Validates a song payload using the specified schema.
	 *
	 * @param {Object} payload - The song payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateSongPayload: (payload) => {
		const validationResult = SongPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = SongsValidator;
