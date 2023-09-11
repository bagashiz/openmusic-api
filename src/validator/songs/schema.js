const Joi = require('joi');

/**
 * Schema for validating the song payload.
 *
 * @type {Joi.ObjectSchema}
 */
const SongPayloadSchema = Joi.object({
	/**
	 * The title of the song.
	 *
	 * @type {string}
	 * @required
	 */
	title: Joi.string().required(),

	/**
	 * The year the song was released.
	 *
	 * @type {number}
	 * @integer
	 * @required
	 */
	year: Joi.number().integer().required(),

	/**
	 * The genre of the song.
	 *
	 * @type {string}
	 * @required
	 */
	genre: Joi.string().required(),

	/**
	 * The performer or artist of the song.
	 *
	 * @type {string}
	 * @required
	 */
	performer: Joi.string().required(),

	/**
	 * The duration of the song in seconds (optional).
	 *
	 * @type {number}
	 * @integer
	 * @optional
	 */
	duration: Joi.number().integer().optional(),

	/**
	 * The ID of the album to which the song belongs (optional).
	 *
	 * @type {string}
	 * @optional
	 */
	albumId: Joi.string().optional(),
});

module.exports = { SongPayloadSchema };
