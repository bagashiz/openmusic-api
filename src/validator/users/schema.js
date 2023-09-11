const Joi = require('joi');

/**
 * Schema for validating user payload.
 * @type {Joi.ObjectSchema}
 */
const UserPayloadSchema = Joi.object({
	/**
	 * The username of the user.
	 *
	 * @type {string}
	 * @required
	 */
	username: Joi.string().required(),

	/**
	 * The password of the user.
	 *
	 * @type {string}
	 * @required
	 */
	password: Joi.string().required(),

	/**
	 * The full name of the user.
	 *
	 * @type {string}
	 * @required
	 */
	fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
