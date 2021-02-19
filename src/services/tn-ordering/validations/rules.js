//Validation Rules

const Joi = require('joi');

const CONTEXT = Joi.string().trim().required();
const RATECENTER = Joi.string().trim().required();
const STATE = Joi.string().trim().min(2).max(2).required();
const NPANXX = Joi.string().trim().min(6).max(6).required();
const NUMBER = Joi.string().trim().min(10).max(10).required();


module.exports = {
  ORDERING: {
    CONTEXT: CONTEXT,
    RATECENTER: RATECENTER,
    STATE: STATE,
    NPANXX: NPANXX,
    NUMBER: NUMBER
  }
};