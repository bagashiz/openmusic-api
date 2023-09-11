const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

/**
 * UsersService is a class that provides methods for managing user data.
 *
 * @class
 */
class UsersService {
	/**
	 * Creates an instance of UsersService.
	 *
	 * @constructor
	 */
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * Adds a new user to the database.
	 *
	 * @param {Object} userData - User data including username, password, and fullname.
	 * @param {string} userData.username - The username of the user.
	 * @param {string} userData.password - The password of the user.
	 * @param {string} userData.fullname - The fullname of the user.
	 * @returns {string} The ID of the newly added user.
	 * @throws {InvariantError} If adding the user fails.
	 * @async
	 */
	async addUser({ username, password, fullname }) {
		await this.verifyNewUsername(username);

		const id = `user-${nanoid(16)}`;
		const hashedPassword = await bcrypt.hash(password, 10);
		const query = {
			text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
			values: [id, username, hashedPassword, fullname],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError('User gagal ditambahkan');
		}
		return result.rows[0].id;
	}

	/**
	 * Verifies the existence of a user by their ID.
	 *
	 * @param {string} id - The ID of the user to verify.
	 * @throws {NotFoundError} If the user is not found.
	 * @async
	 */
	async verifyUser(id) {
		const query = {
			text: 'SELECT * FROM users WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError('User tidak ditemukan');
		}
	}

	/**
	 * Verifies that a new username is not already in use by another user.
	 *
	 * @param {string} username - The username to verify.
	 * @throws {InvariantError} If the username is already in use.
	 * @async
	 */
	async verifyNewUsername(username) {
		const query = {
			text: 'SELECT username FROM users WHERE username = $1',
			values: [username],
		};

		const result = await this._pool.query(query);

		if (result.rows.length > 0) {
			throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
		}
	}

	/**
	 * Gets a user by their ID.
	 *
	 * @param {string} id - The ID of the user to retrieve.
	 * @returns {Object} User information including ID, username, and fullname.
	 * @throws {NotFoundError} If the user is not found.
	 * @async
	 */
	async getUserById(id) {
		const query = {
			text: 'SELECT id, username, fullname FROM users WHERE id = $1',
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('User tidak ditemukan');
		}

		return result.rows[0];
	}

	/**
	 * Verifies user credentials by checking the username and password.
	 *
	 * @param {string} username - The username to verify.
	 * @param {string} password - The password to verify.
	 * @returns {string} The ID of the authenticated user.
	 * @throws {AuthenticationError} If the credentials are invalid.
	 * @async
	 */
	async verifyUserCredential(username, password) {
		const query = {
			text: 'SELECT id, password FROM users WHERE username = $1',
			values: [username],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new AuthenticationError('Kredensial yang Anda berikan salah');
		}

		const { id, password: hashedPassword } = result.rows[0];

		const match = await bcrypt.compare(password, hashedPassword);

		if (!match) {
			throw new AuthenticationError('Kredensial yang Anda berikan salah');
		}
		return id;
	}

	/**
	 * Gets users by their username, allowing partial matches.
	 *
	 * @param {string} username - The username to search for.
	 * @returns {Object[]} An array of user information matching the username.
	 * @async
	 */
	async getUsersByUsername(username) {
		const query = {
			text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
			values: [`%${username}%`],
		};
		const result = await this._pool.query(query);
		return result.rows;
	}
}

module.exports = UsersService;
