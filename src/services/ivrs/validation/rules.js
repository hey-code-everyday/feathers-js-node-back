const Joi = require('joi');

module.exports = {
  TENANTID: Joi.number().integer().required(),
  NAME: Joi.string().required(),
  ALLOWDISA: Joi.string().valid('', 'on').required(),
  LOOPONTIMEOUT: Joi.string().valid('', 'on').required(),
  LOOPONWRONGKEYPRESS: Joi.string().valid('', 'on').required(),
  MAXLOOPS: Joi.number().integer().required(),
  MEID: Joi.number().integer().required(),
  TIMEOUT: Joi.number().integer().required(),
  CREATEDESTINATION: Joi.object({
    id: Joi.number().integer().allow(null),
    type: Joi.string().allow(''),
  }),
  PATCHDESTINATION: Joi.object({
    existingId: Joi.number().integer().allow(null),
    id: Joi.number().integer().allow(null),
    type: Joi.string().allow(''),
  }),
  PHONENUMS: Joi.array().items(Joi.number().integer()),
  DIGITTIMEOUT: Joi.number().integer(),
  PHONENUMSCHANGED: Joi.boolean().required(),
};
