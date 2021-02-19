const Joi = require('joi');
const { schema_INVENTORY, schema_COVERAGE, schema_NUMBERDETAIL } = require('../validations/schema');
const { BadRequest } = require('@feathersjs/errors');

exports.validateQueryString = function () {
  return async context => {

    const { query } = context.params;
    const acceptedContext = ['coverage', 'numberDetails', 'inventory'];

    if(!Object.keys(query).length){
      throw new BadRequest('Missing Expected Query String Parameters!');
    }

    //check if the context parameter exists
    if(!query.hasOwnProperty('context')){
      throw new BadRequest('Expected Query Parameter Context is Missing!');
    }

    const queryContext = query.context;
    if(!acceptedContext.includes(queryContext)){
      throw new BadRequest('Invalid Context Parameter In Query String. Refer to API!');
    }

    //validation for coverage lookup
    if(queryContext === 'coverage'){
      const validationObject = {
        context: queryContext,
        rateCenter: query.rateCenter,
        state: query.state
      };
      const validationResult = schema_COVERAGE.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    }

    //validation for inventory lookup
    if(queryContext === 'inventory'){
      const validationObject = {
        context: queryContext,
        rateCenter: query.rateCenter,
        state: query.state,
        npanxx: query.npanxx.toString()
      };
      const validationResult = schema_INVENTORY.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    }

    //validation for numberDetail lookup
    if(queryContext === 'numberDetails'){
      const validationObject = {
        context: queryContext,
        number: query.number.toString()
      };
      const validationResult = schema_NUMBERDETAIL.validate(validationObject);
      if(validationResult.error){
        throw new BadRequest(validationResult.error);
      }
    }

    return context;
  };
};
