const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema } = require('./schema');

/**
 * UploadsValidator is a utility class for validating file upload headers.
 *
 * @namespace
 */
const UploadsValidator = {
	/**
	 * Validates image headers using the specified schema.
	 *
	 * @param {Object} headers - The image headers to be validated.
	 * @throws {InvariantError} If the headers do not match the schema.
	 */
	validateImageHeaders: (headers) => {
		const validationResult = ImageHeadersSchema.validate(headers);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = UploadsValidator;
