//VALIDATION SCHEMA

const Joi = require('joi');
const RULES = require('./rules');

const schema_NUMBERDETAIL = Joi.object().keys({
  context: RULES.ORDERING.CONTEXT,
  number: RULES.ORDERING.NUMBER
});

const schema_INVENTORY = Joi.object().keys({
  context: RULES.ORDERING.CONTEXT,
  rateCenter: RULES.ORDERING.RATECENTER,
  state: RULES.ORDERING.STATE,
  npanxx: RULES.ORDERING.NPANXX
});

const schema_COVERAGE = Joi.object().keys({
  context: RULES.ORDERING.CONTEXT,
  rateCenter: RULES.ORDERING.RATECENTER,
  state: RULES.ORDERING.STATE
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = { schema_NUMBERDETAIL, schema_INVENTORY, schema_COVERAGE, joiOptions };