//this file ties together the rule to the expected post schema

const Joi = require('joi');
const RULES = require('./rules');

const schema = Joi.object().keys({
  email: RULES.USERNAME,
  userRole: RULES.USERROLE,
  us_useldap: RULES.USELDAP,
  tenantIds: RULES.TENANTS,
  adminQueues: RULES.QUEUES,
  receiveQueueReports: RULES.QUEUEREPORTS,
  tenantId: RULES.TENANT,
  extension: RULES.EXTENSION
});

const schema_UPDATE = Joi.object().keys({
  email: RULES.USERNAME,
  userRole: RULES.USERROLE,
  us_useldap: RULES.USELDAP,
  tenantIds: RULES.TENANTS,
  adminQueues: RULES.QUEUES,
  receiveQueueReports: RULES.QUEUEREPORTS,
  tenantId: RULES.TENANT,
  extension: RULES.EXTENSION,
  password: RULES.PASSWORD,
  resetPassword: RULES.RESETPW,
  enableCallNotifications: RULES.ENABLENOTIFICATIONS,
  enableChatNotifications: RULES.ENABLENOTIFICATIONS
});

const joiOptions = { convert: true, abortEarly: false};

module.exports = {schema, schema_UPDATE, joiOptions};
