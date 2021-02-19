const { schema_PORTAVAIL, schema_CREATE, schema_EDIT } = require('../validation/schema');
const { BadRequest, Forbidden } = require('@feathersjs/errors');

exports.validateQueryString = function () {
  return async context => {

    const { query } = context.params;

    if(!Object.keys(query).length){
      throw new BadRequest('Invalid/Missing Query Parameters!');
    }

    //check context for a simple validating order data object
    if(query.context === 'validateOrderObject'){
      let validationObject = query.formData;
      const validationResult = schema_CREATE.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    } else if(query.context === 'validateEditObject'){
      let validationObject = query.formData;
      const validationResult = schema_EDIT.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    }else{
      const numbers = JSON.parse(query.numbers);
      //validate the query string
      const objectNumbers = numbers.map( number => number.toString());
      let validationObject = {
        numbers: objectNumbers
      };
      const validationResult = schema_PORTAVAIL.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    }

    return context;
  };
};

exports.portCreateAuth = function () {
  return async context => {

    const { userRole, tenantIds } = context.params.user;
    const userId = context.params.user.id;
    const {tenantId, portDate} = context.data[0];

    //make sure the level 3 can has access to the tenant for which the request is being made
    if(+userRole !== 1){
      if(!tenantIds.includes(+tenantId)){
        throw new Forbidden('You Do Not Have Permissions For This Tenant!');
      }
    }

    const tenantRecord = await context.app.service('tenants')._get(tenantId);

    if(!tenantRecord){
      throw new BadRequest('This Tenant Does Not Exist!');
    }

    const {name, tenantCode} = tenantRecord;

    const numberGroups = context.data.length;

    context.data[numberGroups] = {
      callerName: name,
      orderRef: tenantCode+'-'+userId,
      portDate
    };

    return context;
  };
};
