const InvariantError = require('../../exceptions/InvariantError');
const { UserPayloadSchema } = require('./schema');

/**
 * UsersValidator is a utility class for validating user-related payloads.
 *
 * @namespace
 */
const UsersValidator = {
	/**
	 * Validates a user payload using the specified schema.
	 *
	 * @param {Object} payload - The user payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateUserPayload: (payload) => {
		const validationResult = UserPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = UsersValidator;
