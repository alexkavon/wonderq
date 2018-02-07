const Joi = require('joi');
const uuid = require('uuid/v4');

const MessageSchema = Joi.object().keys({
    id: Joi.string().guid().default(uuid(), 'Generates uuid'),
    topic: Joi.string().alphanum().min(3).max(256).required(),
    payload: Joi.object().keys({
        message: Joi.any().required(),
        valid: Joi.boolean().required().default(false)
    }),
    ip: Joi.string().ip().required(),
    timeout: Joi.boolean().required().default(false),
    created: Joi.date().timestamp().default(Date.now, 'Created timestamp'),
    updated: Joi.date().timestamp().default(Date.now, 'Updated timestamp')
});

module.exports = {
    validate: Joi.validate,
    schema: MessageSchema
}