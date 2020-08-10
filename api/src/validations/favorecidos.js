const Joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator();

module.exports = {
    getAll: validator.query(Joi.object({
        page: Joi.number().min(1).default(1),
        perPage: Joi.number().default(10)
    }))
};