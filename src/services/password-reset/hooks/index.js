const {schema, joiOptions} = require('../validation/schema');
const validate = require('@feathers-plus/validate-joi');

exports.validateCreate = function (){
  return validate.form(schema, joiOptions);
};
