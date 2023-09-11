const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * AuthenticationsService is a class that will be used to handle all of the authentication services
 *
 * @class
 */
class AuthenticationsService {
	/**
	 * Creates an instance of AuthenticationsService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds a refresh token to the database.
	 *
	 * @param {string} token - The refresh token to add.
	 * @throws {InvariantError} If adding the refresh token fails.
	 * @async
	 */
	async addRefreshToken(token) {
		const query = {
			text: 'INSERT INTO authentications VALUES($1)',
			values: [token],
		};

		await this._pool.query(query);
	}

	/**
	 * Verifies the validity of a refresh token.
	 *
	 * @param {string} token - The refresh token to verify.
	 * @throws {InvariantError} If the refresh token is not valid.
	 * @async
	 */
	async verifyRefreshToken(token) {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [token],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError('Refresh token tidak valid');
		}
	}

	/**
	 * Deletes a refresh token from the database.
	 *
	 * @param {string} token - The refresh token to delete.
	 * @async
	 */
	async deleteRefreshToken(token) {
		const query = {
			text: 'DELETE FROM authentications WHERE token = $1',
			values: [token],
		};

		await this._pool.query(query);
	}
}

module.exports = AuthenticationsService;
