const Joi = require('@hapi/joi');
const ACCOUNT_TYPES = require('../../../assets/account_types.json');
const BANKS = require('../../../assets/banks.json');
const validator = require('express-joi-validation').createValidator();

const body = validator.body(Joi.object({
    name: Joi.string().required(),
    cpf_cnpj: Joi.string().required(),
    email: Joi.string().email().required(),
    bank: Joi.string().valid(...BANKS).required(),
    agency: Joi.when('bank', {
        is: '001',
        then: Joi.string().pattern(/^(?!0+$)[0-9]{0,4}$/),
        otherwise: Joi.string().pattern(/^(?!0+$)[0-9]{0,10}$/)
    }).required(),
    agency_digit: Joi.when('bank', {
        is: '001',
        then: Joi.string().allow(null).pattern(/^[xX0-9]{0,1}$/),
        otherwise: Joi.string().allow(null).pattern(/^[0-9]{0,1}$/)
    }),
    account: Joi.when('bank', {
        is: '001',
        then: Joi.string().pattern(/^(?!0+$)[0-9]{0,8}$/),
        otherwise: Joi.string().pattern(/^(?!0+$)[0-9]{0,11}$/)
    }).required(),
    account_digit: Joi.string().pattern(/^[0-9]{0,1}$/).required(),
    account_type: Joi.when('bank', {
        is: '001',
        then: Joi.string().valid(...ACCOUNT_TYPES.bb).required(),
        otherwise: Joi.string().valid(...ACCOUNT_TYPES.other)
    }).required(),
    status: Joi.string().default('draft').valid('draft', 'validated')
}));

const params = validator.params(Joi.object({
    id: Joi.string().max(24).required()
}));

module.exports = {
    getAll: {
        query: validator.query(Joi.object({
            page: Joi.number().min(1).default(1),
            perPage: Joi.number().default(10),
            search: Joi.string()
        }))
    },
    getOne: {
        params,
    },
    create: {
        body
    },
    update: {
        params,
        body
    },
    delete: {
        params
    },
    deleteMany: {
        body: validator.body(Joi.object({
            ids: Joi.array().items(Joi.string().max(24)).min(1).required()
        }))
    }
};