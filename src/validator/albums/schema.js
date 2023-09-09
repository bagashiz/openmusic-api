const Joi = require('joi');

/**
 * AlbumPayloadSchema is a class that defines the schema for the payload
 */
const AlbumPayloadSchema = Joi.object({
	name: Joi.string().required(),
	year: Joi.number().integer().required(),
});

module.exports = { AlbumPayloadSchema };
