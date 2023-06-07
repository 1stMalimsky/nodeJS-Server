const Joi = require("joi");

const userIdSchema = Joi.string().hex().length(24)


const validateUserId = (input) => {
    userIdSchema.validateAsync(input);
}

module.exports = { validateUserId };