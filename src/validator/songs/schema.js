const Joi = require('joi');

/**
 * SongPayloadSchema is a class that defines the schema for the payload
 */
const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number().integer().optional(),
    albumId: Joi.string().optional(),
});

module.exports = { SongPayloadSchema };
