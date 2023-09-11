const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

/**
 * CollaborationsValidator is a utility class for validating collaboration-related payloads.
 *
 * @namespace
 */
const CollaborationsValidator = {
	/**
	 * Validates a collaboration payload using the specified schema.
	 *
	 * @param {Object} payload - The collaboration payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateCollaborationPayload: (payload) => {
		const validationResult = CollaborationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = CollaborationsValidator;
