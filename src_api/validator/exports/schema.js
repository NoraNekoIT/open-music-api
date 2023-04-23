const Joi = require("joi");

const ExportPlaylistByIdSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = ExportPlaylistByIdSchema;
