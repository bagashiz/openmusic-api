const Joi = require('joi');

/**
 * Schema for validating collaboration payloads.
 *
 * @type {Joi.ObjectSchema}
 */
const CollaborationPayloadSchema = Joi.object({
	/**
	 * The ID of the playlist for the collaboration.
	 *
	 * @type {string}
	 * @required
	 */
	playlistId: Joi.string().required(),

	/**
	 * The ID of the user for the collaboration.
	 *
	 * @type {string}
	 * @required
	 */
	userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
