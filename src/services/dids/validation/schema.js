//VALIDATION SCHEMA

const Joi = require('joi');
const RULES = require('./rules');

const schema_CREATE = Joi.object().keys({
  tenantId: RULES.DID.TENANTID,
  numbers: RULES.DID.NUMBERS,
  orderType: RULES.DID.ORDERTYPE,
  branch: RULES.DID.BRANCH,
});

const schema_UPDATE = Joi.object().keys({
  callerId: RULES.DID.CALLERID,
  tenantId: RULES.DID.TENANTID,
  namePrefix: RULES.DID.NAMEPREFIX,
  recording: RULES.DID.RECORDING,
  callerIdUpdated: RULES.DID.CALLERIDUPDATED,
  branch: RULES.DID.BRANCH,
});

const joiOptions = { convert: true, abortEarly: false };

module.exports = { schema_CREATE, schema_UPDATE, joiOptions };
