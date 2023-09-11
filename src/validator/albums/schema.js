const Joi = require('joi');

/**
 * AlbumPayloadSchema is a Joi schema for validating album payloads.
 *
 * @type {Joi.ObjectSchema}
 */
const AlbumPayloadSchema = Joi.object({
	/**
	 * The name of the album.
	 *
	 * @type {string}
	 * @required
	 */
	name: Joi.string().required(),

	/**
	 * The year the album was released.
	 *
	 * @type {number}
	 * @integer
	 * @required
	 */
	year: Joi.number().integer().required(),
});

module.exports = { AlbumPayloadSchema };
