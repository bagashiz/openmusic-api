const Joi = require('joi');

/**
 * Schema for validating the POST request payload for authentication.
 *
 * @type {Joi.ObjectSchema}
 */
const PostAuthenticationPayloadSchema = Joi.object({
	/**
	 * The username for authentication.
	 *
	 * @type {string}
	 * @required
	 */
	username: Joi.string().required(),

	/**
	 * The password for authentication.
	 *
	 * @type {string}
	 * @required
	 */
	password: Joi.string().required(),
});

/**
 * Schema for validating the PUT request payload for authentication.
 * @type {Joi.ObjectSchema}
 */
const PutAuthenticationPayloadSchema = Joi.object({
	/**
	 * The refresh token for authentication.
	 *
	 * @type {string}
	 * @required
	 */
	refreshToken: Joi.string().required(),
});

/**
 * Schema for validating the DELETE request payload for authentication.
 *
 * @type {Joi.ObjectSchema}
 */
const DeleteAuthenticationPayloadSchema = Joi.object({
	/**
	 * The refresh token for authentication.
	 *
	 * @type {string}
	 * @required
	 */
	refreshToken: Joi.string().required(),
});

module.exports = {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
};
