//validation rules

const Joi = require('joi');

const USERNAME = Joi.string().trim().email().required();
const PASSWORD = Joi.string().trim().min(5);
const RESETPW = Joi.boolean().required();
const USERROLE = Joi.required();
const USELDAP = Joi.required().allow('');
const TENANTS = Joi.array();
const QUEUES = Joi.array();
const QUEUEREPORTS = Joi.number().integer().required();
const TENANT = Joi.number().integer().required().allow(null);
const EXTENSION = Joi.string().required().allow('');
const ENABLENOTIFICATIONS = Joi.boolean().optional();

module.exports = {
  USERNAME,
  PASSWORD,
  USERROLE,
  USELDAP,
  TENANTS,
  QUEUES,
  QUEUEREPORTS,
  RESETPW,
  TENANT,
  EXTENSION,
  ENABLENOTIFICATIONS
};
