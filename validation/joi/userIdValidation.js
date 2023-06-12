const Joi = require("joi");

const mongooseIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});


const validateId = (input) =>
    mongooseIdSchema.validateAsync(input);

module.exports = validateId;