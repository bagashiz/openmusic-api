const Joi = require('joi');

/**
 * Schema for validating image headers.
 *
 * @type {Joi.ObjectSchema}
 */
const ImageHeadersSchema = Joi.object({
	/**
	 * The 'content-type' header specifying the image format.
	 *
	 * @type {string}
	 * @valid 'image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'
	 * @required
	 */
	'content-type': Joi.string()
		.valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp')
		.required(),
}).unknown();

module.exports = { ImageHeadersSchema };
