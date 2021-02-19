const Joi = require('joi');
const RULES = require('./rules');

const keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'SHARP', 'STAR'];

const commonSchema = {
  tenantId: RULES.TENANTID,
  name: RULES.NAME,
  allowDisa: RULES.ALLOWDISA,
  loopOnTimeout: RULES.LOOPONTIMEOUT,
  loopOnWrongKeyPress: RULES.LOOPONWRONGKEYPRESS,
  maxLoops: RULES.MAXLOOPS,
  meId: RULES.MEID,
  timeout: RULES.TIMEOUT,
  phoneNums: RULES.PHONENUMS,
};

const createSchema = { ...commonSchema };
const patchSchema = { ...commonSchema };

keys.forEach((key) => {
  createSchema[`key${key}Dst`] = RULES.CREATEDESTINATION;
  patchSchema[`key${key}Dst`] = RULES.PATCHDESTINATION;
});

const schema = Joi.object().keys({
  ...createSchema,
  timeoutDst: RULES.CREATEDESTINATION,
  wrongKeyPressDst: RULES.CREATEDESTINATION,
});

const updateSchema = Joi.object().keys({
  ...patchSchema,
  timeoutDst: RULES.PATCHDESTINATION,
  wrongKeyPressDst: RULES.PATCHDESTINATION,
  phoneNumsChanged: RULES.PHONENUMSCHANGED,
  digitTimeout: RULES.DIGITTIMEOUT,
});

const joiOptions = { convert: true, abortEarly: false };

module.exports = { updateSchema, schema, joiOptions };
