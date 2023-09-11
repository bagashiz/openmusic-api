const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

/**
 * AlbumsValidator is a utility class for validating album-related payloads.
 *
 * @namespace
 */
const AlbumsValidator = {
	/**
	 * Validates an album payload using the specified schema.
	 *
	 * @param {Object} payload - The album payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateAlbumPayload: (payload) => {
		const validationResult = AlbumPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = AlbumsValidator;
