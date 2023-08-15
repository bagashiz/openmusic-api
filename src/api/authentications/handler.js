const autoBind = require('auto-bind');

/**
 * AuthenticationsHandler is a class that will be used to
 * handle all of the HTTP requests that related to authentications.
 */
class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        autoBind(this);
    }

    /**
     * postAuthenticationHandler is a function that will be used to
     * handle the HTTP POST request to create new authentication.
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
     * putAuthenticationHandler is a function that will be used to
     * handle the HTTP PUT request to update authentication.
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
     *  deleteAuthenticationHandler is a function that will be used to
     * handle the HTTP DELETE request to delete authentication.
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
