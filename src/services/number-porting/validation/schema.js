//VALIDATION SCHEMA

const Joi = require('joi');
const RULES = require('./rules');

const schema_PORTAVAIL = Joi.object().keys({
  numbers: RULES.PORT.NUMBERARRAY
});

const schema_CREATE = Joi.object().keys({
  tenantId: RULES.PORT.TENANTID,
  numberArray: RULES.PORT.NUMBERARRAY,
  accountNumber: RULES.PORT.ACCOUNTNUMBER,
  companyName: RULES.PORT.COMPANYNAME,
  authorizedPerson: RULES.PORT.AUTHPERSON,
  portDate: RULES.PORT.PORTDATE,
  streetNum: RULES.PORT.STREETNUM,
  streetInfo: RULES.PORT.STREETINFO,
  city: RULES.PORT.CITY,
  state: RULES.PORT.STATE,
  postalCode: RULES.PORT.POSTALCODE,
  location: RULES.PORT.LOCATION,
  accountPin: RULES.PORT.ACCOUNTPIN
});

const schema_EDIT = Joi.object().keys({
  streetNum: RULES.PORT.STREETNUM,
  streetName: RULES.PORT.STREETINFO,
  city: RULES.PORT.CITY,
  state: RULES.PORT.STATE,
  postalCode: RULES.PORT.POSTALCODE,
  locationType1: RULES.PORT.LOCATIONTYPE1,
  locationValue1: RULES.PORT.LOCATIONVALUE1,
  name: RULES.PORT.NAME,
  accountNum: RULES.PORT.ACCOUNTNUMBER,
  trunkGroup: RULES.PORT.TRUNKGROUP,
  atn: RULES.PORT.ATN,
  authName: RULES.PORT.COMPANYNAME,
  authDate: RULES.PORT.AUTHDATE,
  accountPin: RULES.PORT.ACCOUNTPIN
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = { schema_CREATE, schema_EDIT, schema_PORTAVAIL, joiOptions };
