//validation rules

const Joi = require('joi');

const PASSWORD = Joi.string().trim().min(5);

module.exports = {
  PASSWORD: PASSWORD,
};
