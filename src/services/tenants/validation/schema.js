//this file ties together the rule to the expected post schema

const Joi = require('joi');
const RULES = require('./rules');

const schema_CREATE = Joi.object().keys({
  //tenant
  name: RULES.TENANT.NAME,
  timeZone: RULES.TENANT.TIMEZONE

});

const schema_UPDATE = Joi.object().keys({
  name: RULES.TENANT.NAME,
  timeZone: RULES.TENANT.TIMEZONE
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = {schema_CREATE, schema_UPDATE, joiOptions};