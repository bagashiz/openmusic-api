/**
 * Represents an error that occurs on the client side.
 *
 * @class
 * @extends Error
 */
class ClientError extends Error {
	/**
	 * Creates an instance of ClientError.
	 *
	 * @param {string} message - The error message.
	 * @param {number} [statusCode=400] - The HTTP status code for the error (default is 400 Bad Request).
	 */
	constructor(message, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = 'ClientError';
	}
}

module.exports = ClientError;
