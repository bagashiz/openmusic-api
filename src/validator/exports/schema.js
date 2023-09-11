const Joi = require('joi');

/**
 * Schema for validating the export songs payload.
 *
 * @type {Joi.ObjectSchema}
 */
const ExportSongsPayloadSchema = Joi.object({
	/**
	 * The target email address for exporting songs.
	 *
	 * @type {string}
	 * @email { tlds: true }
	 * @required
	 */
	targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportSongsPayloadSchema;
