const ExportSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * ExportsValidator is a utility class for handling export-related payload validations.
 *
 * @namespace
 */
const ExportsValidator = {
	/**
	 * Validates an export songs payload using the specified schema.
	 *
	 * @param {Object} payload - The export songs payload to be validated.
	 * @throws {InvariantError} If the payload does not match the schema.
	 */
	validateExportSongsPayload: (payload) => {
		const validationResult = ExportSongsPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = ExportsValidator;
