//Validation Rules

const Joi = require('joi');

const COMPANYNAME = Joi.string().trim().required();
const STREETNUM = Joi.string().trim().required();
const STREETINFO = Joi.string().trim().required();
const LOCATION = Joi.string().trim().allow('');
const CITY = Joi.string().trim().required();
const STATE = Joi.string().min(2).max(2).required();
const POSTALCODE = Joi.string().trim().required();
const TENANTID = Joi.number().integer().required();
const PORTDATE = Joi.string().trim().required();
const ACCOUNTNUMBER = Joi.string().trim().required().allow('');
const AUTHPERSON = Joi.string().trim().required();
const NUMBERARRAY = Joi.array().items(Joi.string().min(10).max(10)).min(1).required();
const LOCATIONTYPE1 = Joi.string().trim().allow('');
const LOCATIONVALUE1 = Joi.string().trim().allow('');
const NAME = Joi.string().trim().allow('');
const TRUNKGROUP = Joi.string().trim().required();
const ATN = Joi.string().required();
const ACCOUNTPIN = Joi.string().required().allow('');
const AUTHDATE = Joi.string().trim().required();


module.exports = {
  PORT: {
    TENANTID: TENANTID,
    COMPANYNAME: COMPANYNAME,
    STREETNUM: STREETNUM,
    STREETINFO: STREETINFO,
    LOCATION: LOCATION,
    CITY: CITY,
    STATE: STATE,
    POSTALCODE: POSTALCODE,
    PORTDATE: PORTDATE,
    ACCOUNTNUMBER: ACCOUNTNUMBER,
    AUTHPERSON: AUTHPERSON,
    NUMBERARRAY: NUMBERARRAY,
    LOCATIONTYPE1: LOCATIONTYPE1,
    LOCATIONVALUE1: LOCATIONVALUE1,
    NAME: NAME,
    TRUNKGROUP: TRUNKGROUP,
    ATN: ATN,
    AUTHDATE: AUTHDATE,
    ACCOUNTPIN: ACCOUNTPIN
  }
};
