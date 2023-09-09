const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

/**
 * SongsValidator is a class that will be used to validate the payload
 */
const SongsValidator = {
	validateSongPayload: (payload) => {
		const validationResult = SongPayloadSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = SongsValidator;
