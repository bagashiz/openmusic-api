const autoBind = require('auto-bind');

/**
 * UsersHandler is a class for handling user-related routes.
 *
 * @class
 */
class UsersHandler {
	/**
	 * Creates an instance of UsersHandler.
	 *
	 * @constructor
	 * @param {UsersService} service - The user service.
	 * @param {UsersValidator} validator - The user data validator.
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the POST request to add a user.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async postUserHandler(request, h) {
		this._validator.validateUserPayload(request.payload);
		const { username, password, fullname } = request.payload;

		const userId = await this._service.addUser({ username, password, fullname });

		const response = h.response({
			status: 'success',
			message: 'User berhasil ditambahkan',
			data: {
				userId,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the GET request to get a user by ID.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async getUserByIdHandler(request) {
		const { id } = request.params;

		const user = await this._service.getUserById(id);

		return {
			status: 'success',
			data: {
				user,
			},
		};
	}

	/**
	 * Handles the GET request to get users by username.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async getUsersByUsernameHandler(request) {
		const { username = '' } = request.query;
		const users = await this._service.getUsersByUsername(username);
		return {
			status: 'success',
			data: {
				users,
			},
		};
	}
}

module.exports = UsersHandler;
