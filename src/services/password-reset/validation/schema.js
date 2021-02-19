//this file ties together the rule to the expected post schema

const Joi = require('joi');
const RULES = require('./rules');

const schema = Joi.object().keys({
  password: RULES.PASSWORD,
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = {schema, joiOptions};
