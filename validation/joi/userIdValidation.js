const Joi = require("joi");

const userIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});


const validateId = (input) =>
    userIdSchema.validateAsync(input);

module.exports = validateId;