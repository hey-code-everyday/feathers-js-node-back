//Validation Rules

const Joi = require('joi');

const NAME = Joi.string().trim().required();
const STREETNUM = Joi.string().trim().required();
const STREETINFO = Joi.string().trim().required();
const LOCATION = Joi.string().trim().allow('');
const CITY = Joi.string().trim().required();
const STATE = Joi.string().min(2).max(2).required();
const POSTALCODE = Joi.string().trim().required();
const TENANTID = Joi.number().integer().required();

module.exports = {
  E911: {
    TENANTID,
    NAME,
    STREETNUM,
    STREETINFO,
    LOCATION,
    CITY,
    STATE,
    POSTALCODE
  }
};
