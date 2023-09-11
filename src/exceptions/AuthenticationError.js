const ClientError = require('./ClientError');

/**
 * Represents an error that occurs during authentication.
 *
 * @class
 * @extends ClientError
 */
class AuthenticationError extends ClientError {
	/**
	 * Creates an instance of AuthenticationError.
	 *
	 * @param {string} message - The error message.
	 */
	constructor(message) {
		super(message, 401);
		this.name = 'AuthenticationError';
	}
}

module.exports = AuthenticationError;
