//Validation Rules

const Joi = require('joi');

const TENANTID = Joi.number().integer().required();
const NUMBERS = Joi.array()
  .items(Joi.string().min(10).max(10))
  .min(1)
  .required();
const CALLERID = Joi.string().trim().required();
const NAMEPREFIX = Joi.string().trim().allow('');
const RECORDING = Joi.string().trim().required();
const CALLERIDUPDATED = Joi.boolean().truthy('true').falsy('false');
const ORDERTYPE = Joi.string().optional().valid('MANUAL', 'ORDERING');
const BRANCH = Joi.string().optional();

module.exports = {
  DID: {
    TENANTID: TENANTID,
    NUMBERS: NUMBERS,
    CALLERID: CALLERID,
    NAMEPREFIX: NAMEPREFIX,
    RECORDING: RECORDING,
    CALLERIDUPDATED: CALLERIDUPDATED,
    ORDERTYPE: ORDERTYPE,
    BRANCH,
  },
};
