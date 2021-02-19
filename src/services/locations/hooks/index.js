const didDefaults = require('../validation/defaults');
const { Forbidden } = require('@feathersjs/errors');
const {
  iq_authenticate,
  iq_validateAddress,
  iq_tnInventory911,
  iq_order911,
  iq_update911,
  iq_removeE911,
  iq_tnDisconnect
} = require('../../../inteliquent/api');
const getIqParams = require('../../../inteliquent/inteliquent-params');

const validate = require('@feathers-plus/validate-joi');
const {schema_CREATE, schema_UPDATE, joiOptions} = require('../validation/schema');

exports.forceEmergencyOn = function () {
  return async context => {

    context.params.query = {
      ...context.params.query,
      allowEmergency: 'on'
    };

    return context;
  };
};

exports.provisionLocation = function () {
  return async context => {

    const { userRole, tenantIds } = context.params.user;
    const {tenantId} = context.data;

    if(+userRole !== 1){
      if(!tenantIds.includes(+tenantId)){
        throw new Forbidden('You Do Not Have Permission For This Tenant!');
      }
    }

    //authenticate and get access token
    const iqParams = await getIqParams(context.app);
    const accessToken = await iq_authenticate(iqParams);

    //validate the posted address. throws error or return address object
    const validAddress = await iq_validateAddress(context.data.address, accessToken, iqParams);

    //lookup a new number for the e911
    const requestNumber = await iq_tnInventory911(accessToken, iqParams);

    //finally compile all of the validated info and order tn with e911 feature
    const orderData = {
      name: context.data.address.name,
      number: requestNumber
    };
    Object.assign(orderData, validAddress);

    await iq_order911(orderData, accessToken, iqParams);

    //now set up form fields used for the create method to insert new DID
    context.data = {
      tenantId,
      number: requestNumber,
      diCommentName: context.data.address.name,
      allowEmergency: 'on',
      emergencyNotes: JSON.stringify(validAddress),
    };
    Object.assign(context.data, didDefaults.DID);

    return context;
  };
};

exports.locationDeleteAuth = function (options = {}) {
  return async context => {


    const recordId = context.id;
    const { userRole, tenantIds } = context.params.user;

    const LocationRecord = await context.app.service('locations')._get(recordId);

    //if there is no record for requested id
    if(!LocationRecord){
      throw new Forbidden('E911 Record Does Not Exist');
    }

    //if this is not an emergency location do not allow delete
    if(LocationRecord.allowEmergency !== 'on'){
      throw new Forbidden('Permission Denied. This is not an Emergency Location!');
    }

    const extensions = await context.app.service('extensions')._find({
      paginate: false,
      query: {
        emergencyCidNum: LocationRecord.number
      }
    });

    if(extensions.length){
      throw new Forbidden('Permission Denied! This Location is in Use By ' + extensions.length + ' Extensions!');
    }

    //if level 3 user we need to make sure this tenant is allowed
    if(+userRole !== 1){
      if(!tenantIds.includes(LocationRecord.tenantId)){
        throw new Forbidden('You do not have permission to modify records for this tenant!');
      }
    }

    //call the intelliquent api to remove e911
    //authenticate and get access token
    const iqParams = await getIqParams(context.app);
    const accessToken = await iq_authenticate(iqParams);

    //remove 911 and Disconnect
    await iq_removeE911(LocationRecord.number, accessToken, iqParams);
    await iq_tnDisconnect(LocationRecord.number, accessToken, iqParams);

    return context;
  };
};

exports.locationUpdateAuth = function () {
  return async context => {

    const recordId = context.id;
    const {userRole} = context.params.user;

    const LocationRecord = await context.app.service('locations')._get(recordId);

    //no record throw error
    if(!LocationRecord){
      throw new Forbidden('E911 Record Does Not Exist!');
    }

    if(LocationRecord.allowEmergency !== 'on'){
      throw new Forbidden('Permission Denied. This is not an Emergency Location');
    }

    if(+userRole !== 1){

      const {tenantIds} = context.params.user;

      if(!tenantIds.includes(LocationRecord.tenantId)){
        throw new Forbidden('You Do Not Have Permission to Modify Records for This Tenant!');
      }

    }

    const iqParams = await getIqParams(context.app);
    const accessToken = await iq_authenticate(iqParams);

    //validate the posted address. throws error or return address object
    const validAddress = await iq_validateAddress(context.data.address, accessToken, iqParams);

    //provision the e911 number with new info
    const updateData = {
      number: LocationRecord.number,
      name: context.data.address.name
    };
    Object.assign(updateData, validAddress);
    await iq_update911(updateData, accessToken, iqParams);

    context.data = {
      diCommentName: context.data.address.name,
      allowEmergency: 'on',
      emergencyNotes: JSON.stringify(validAddress),
    };

    return context;
  };
};

exports.validateCreate = function () {
  return validate.form(schema_CREATE, joiOptions);
};

exports.validateUpdate = function () {
  return validate.form(schema_UPDATE, joiOptions);
};
