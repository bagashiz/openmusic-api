const {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * AuthenticationsValidator is a utility class for handling authentication payload validations.
 *
 * @namespace
 */
const AuthenticationsValidator = {
	/**
	 * Validates a POST authentication payload using the specified schema.
	 *
	 * @param {Object} payload - The authentication payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validatePostAuthenticationPayload: (payload) => {
		const validationResult = PostAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},

	/**
	 * Validates a PUT authentication payload using the specified schema.
	 *
	 * @param {Object} payload - The authentication payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validatePutAuthenticationPayload: (payload) => {
		const validationResult = PutAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},

	/**
	 * Validates a DELETE authentication payload using the specified schema.
	 *
	 * @param {Object} payload - The authentication payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateDeleteAuthenticationPayload: (payload) => {
		const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = AuthenticationsValidator;
