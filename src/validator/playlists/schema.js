const Joi = require('joi');

/**
 * Schema for validating the playlist payload.
 *
 * @type {Joi.ObjectSchema}
 */
const PlaylistPayloadSchema = Joi.object({
	/**
	 * The name of the playlist.
	 *
	 * @type {string}
	 * @required
	 */
	name: Joi.string().required(),
});

/**
 * Schema for validating the playlist song payload.
 *
 * @type {Joi.ObjectSchema}
 */
const PlaylistSongPayloadSchema = Joi.object({
	/**
	 * The ID of the song to be added to the playlist.
	 *
	 * @type {string}
	 * @required
	 */
	songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, PlaylistSongPayloadSchema };
