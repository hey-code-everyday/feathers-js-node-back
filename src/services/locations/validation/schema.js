//VALIDATION SCHEMA

const Joi = require('joi');
const RULES = require('./rules');

const schema_CREATE = Joi.object().keys({
  tenantId: RULES.E911.TENANTID,
  address: {
    name: RULES.E911.NAME,
    streetNum: RULES.E911.STREETNUM,
    streetInfo: RULES.E911.STREETINFO,
    city: RULES.E911.CITY,
    state: RULES.E911.STATE,
    postalCode: RULES.E911.POSTALCODE,
    location: RULES.E911.LOCATION
  }
});

const schema_UPDATE = Joi.object().keys({
  address: {
    name: RULES.E911.NAME,
    streetNum: RULES.E911.STREETNUM,
    streetInfo: RULES.E911.STREETINFO,
    city: RULES.E911.CITY,
    state: RULES.E911.STATE,
    postalCode: RULES.E911.POSTALCODE,
    location: RULES.E911.LOCATION,
    locationType: RULES.E911.LOCATION,
    locationNumber: RULES.E911.LOCATION
  }
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = { schema_CREATE, schema_UPDATE, joiOptions };
