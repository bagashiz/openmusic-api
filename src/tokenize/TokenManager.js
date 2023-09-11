const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

/**
 * TokenManager is an object that provides helper methods for generating and verifying tokens.
 *
 * @namespace
 */
const TokenManager = {
	/**
	 * Generates an access token.
	 *
	 * @param {Jwt.HapiJwt.Payload} payload - The payload of the JWT token from '@hapi/jwt'.
	 * @returns {string} The access token.
	 */
	generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),

	/**
	 * Generates a refresh token.
	 *
	 * @param {Jwt.HapiJwt.Payload} payload - The payload of the JWT token from '@hapi/jwt'.
	 * @returns {string} The refresh token.
	 */
	generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

	/**
	 * Verifies an access token by checking its signature.
	 *
	 * @param {string} refreshToken - The refresh token to be verified.
	 * @returns {Jwt.HapiJwt.DecodedToken} The decoded payload of the refresh token.
	 * @throws {InvariantError} Thrown when the refresh token is not valid.
	 */
	verifyRefreshToken: (refreshToken) => {
		try {
			const artifacts = Jwt.token.decode(refreshToken);
			Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
			const { payload } = artifacts.decoded;
			return payload;
		} catch (error) {
			throw new InvariantError('Refresh token tidak valid');
		}
	},
};

module.exports = TokenManager;
