//validation rules
const Joi = require('joi');

//form fields
const NAME = Joi.string().trim().required();
const TIMEZONE = Joi.string().trim().required();

module.exports = {
  TENANT: {
    NAME: NAME,
    TIMEZONE: TIMEZONE,
  }
};
