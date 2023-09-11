const ClientError = require('./ClientError');

/**
 * Represents a 404 Not Found error.
 *
 * @class
 * @extends ClientError
 */
class NotFoundError extends ClientError {
	/**
	 * Creates an instance of NotFoundError.
	 *
	 * @param {string} message - The error message.
	 */
	constructor(message) {
		super(message, 404);
		this.name = 'NotFoundError';
	}
}

module.exports = NotFoundError;
