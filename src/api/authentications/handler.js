const autoBind = require('auto-bind');

/**
 * AuthenticationsHandler is a class that handles HTTP requests related to authentications.
 *
 * @class
 */
class AuthenticationsHandler {
	/**
	 * Creates an instance of AuthenticationsHandler.
	 *
	 * @constructor
	 * @param {AuthenticationsService} authenticationsService - The service for handling authentications.
	 * @param {UsersService} usersService - The service for handling users.
	 * @param {TokenManager} tokenManager - The token manager for generating and verifying tokens.
	 * @param {UsersValidator} validator - The validator for users.
	 */
	constructor(authenticationsService, usersService, tokenManager, validator) {
		this._authenticationsService = authenticationsService;
		this._usersService = usersService;
		this._tokenManager = tokenManager;
		this._validator = validator;

		autoBind(this);
	}

	/**
	 * Handles the HTTP POST request to create a new authentication.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @param {ResponseToolkit} h - The Hapi.js response toolkit.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */

	async postAuthenticationHandler(request, h) {
		this._validator.validatePostAuthenticationPayload(request.payload);

		const { username, password } = request.payload;
		const id = await this._usersService.verifyUserCredential(username, password);

		const accessToken = this._tokenManager.generateAccessToken({ id });
		const refreshToken = this._tokenManager.generateRefreshToken({ id });

		await this._authenticationsService.addRefreshToken(refreshToken);

		const response = h.response({
			status: 'success',
			message: 'Authentication berhasil ditambahkan',
			data: {
				accessToken,
				refreshToken,
			},
		});
		response.code(201);
		return response;
	}

	/**
	 * Handles the HTTP PUT request to update authentication.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async putAuthenticationHandler(request) {
		this._validator.validatePutAuthenticationPayload(request.payload);

		const { refreshToken } = request.payload;
		await this._authenticationsService.verifyRefreshToken(refreshToken);
		const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

		const accessToken = this._tokenManager.generateAccessToken({ id });
		return {
			status: 'success',
			message: 'Access Token berhasil diperbarui',
			data: {
				accessToken,
			},
		};
	}

	/**
	 * Handles the HTTP DELETE request to delete authentication.
	 *
	 * @param {Request} request - The Hapi.js request object.
	 * @returns {ResponseObject} The HTTP response.
	 * @async
	 */
	async deleteAuthenticationHandler(request) {
		this._validator.validateDeleteAuthenticationPayload(request.payload);

		const { refreshToken } = request.payload;
		await this._authenticationsService.verifyRefreshToken(refreshToken);
		await this._authenticationsService.deleteRefreshToken(refreshToken);

		return {
			status: 'success',
			message: 'Refresh token berhasil dihapus',
		};
	}
}

module.exports = AuthenticationsHandler;
