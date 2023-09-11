const ClientError = require('./ClientError');

/**
 * Represents an error that occurs when authorization is denied.
 *
 * @class
 * @extends ClientError
 */
class AuthorizationError extends ClientError {
	/**
	 * Creates an instance of AuthorizationError.
	 *
	 * @param {string} message - The error message.
	 */
	constructor(message) {
		super(message, 403);
		this.name = 'AuthorizationError';
	}
}

module.exports = AuthorizationError;
