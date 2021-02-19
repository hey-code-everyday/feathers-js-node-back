const {Forbidden} = require('@feathersjs/errors');

const validate = require('@feathers-plus/validate-joi');
const {schema_CREATE, schema_UPDATE, joiOptions} = require('../validation/schema');

const defaults = require('../validation/tenant-defaults');
const constants = require('../../../ref/constants');

const alpha = constants.TENANT_ADDON_CODES;

exports.addTenantDefaults = function () {
  return async context => {

    const { name } = context.data;

    Object.assign(context.data, defaults.TENANT, {settings: defaults.SETTINGS}, {parkinglots: defaults.PARKINGLOTS});

    //now we have to deal with the te_code thing
    const stripSpaces = name.replace(/\s/g, '');
    const stripDashes = stripSpaces.replace(/-/g, '').substr(0,3).toLowerCase();

    //this loop guarantees that we generate a unique name code :)
    let unique = 0;
    let count = 0;
    let newNameCode = stripDashes;
    while (!unique){
      const fetchTenants = await context.app.service('tenants')._find({paginate: false, query: {tenantCode: newNameCode}});
      if(fetchTenants.length){
        newNameCode = stripDashes + alpha[count];
        count++;
      }else{
        unique = 1;
      }
    }

    Object.assign(context.data, {tenantCode: newNameCode});

    return context;
  };
};

exports.createTenantRelations = function () {
  return async context => {

    const tenantId = context.result.id;
    const {tenantCode} = context.result;

    //let us insert tenant settings
    const { settings } = context.data;

    let settingsRecords = [];
    let count = 0;

    Object.keys(settings).forEach( (key) => {
      settingsRecords[count] = {
        code: key,
        value: settings[key],
        tenantId: tenantId
      };
      count++;
    });

    context.app.service('tenant-settings')._create(settingsRecords);

    //let us create phonebook for this tenant
    const phonebook = await context.app.service('phonebooks')._create({
      name: 'Default',
      includeExt: 'yes',
      tenantId
    });

    //let us create parking lots entry
    context.app.service('parkinglots')._create({
      tenantId,
      name: tenantCode,
      start: '71',
      end: '74',
      hosted: ''
    });

    //let us create phonebook layout
    const phonebookLayoutsEntries = [
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 2, order: 1},
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 11, order: 2},
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 12, order: 3},
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 4, order: 4},
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 5, order: 5},
      {tenantId, phonebookId: phonebook.id, phonebookItemsId: 17, order: 6}
    ];
    context.app.service('phonebook-layouts')._create(phonebookLayoutsEntries);

    //create new destination for unassigned DID
    context.app.service('destinations')._create({
      tenantId,
      typeSrc: 'DID-UNASSIGNED',
      typeIdSrc: tenantId,
      typeDst: 'PLAYBACK',
      typeIdDst: '2349',
      order: '1'
    });

    //if a level 3 user is making this request
    if(context.params.hasOwnProperty('user')){

      const userId = context.params.user.id;
      const {userRole} = context.params.user;

      if( +userRole === 3 ){
        await context.app.service('users-tenants')._create({
          userId,
          tenantId
        });
        const userRecord = await context.app.service('users').find(({
          paginate: false,
          query: {
            id: userId
          }
        }));
        delete userRecord[0].password;
        const eventData = {
          userRecord: userRecord[0],
          newAccount: context.result
        };
        context.app.service('users').emit('updateUserTenants', eventData);
      }
    }

    return context;
  };
};

exports.removeTenantPivots = function () {
  return async context => {

    const { id } = context.result;

    context.app.service('users-tenants').remove(null, {
      query: {
        tenantId: id
      }
    });

    return context;
  };
};

exports.tenantFindAuth = function () {
  return async context => {

    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole, myExtension, email, tenantIds } = context.params.user;

    //if user role is level 5 we only want to return the tenant id for their extension
    if(+userRole === 5 || +userRole === 7){

      if(!myExtension){
        const extension = await context.app.service('extensions')._find({
          query: {
            email
          }
        });
        if(!extension.length){
          throw new Forbidden('You must have an anchor tenant to make this call!');
        }
        context.params.user.myExtension = {
          tenantId: extension[0].tenantId
        };
      }

      const {tenantId} = context.params.user.myExtension;
      context.params.query = {
        id: tenantId,
        $select: ['name', 'id', 'tenantCode']
      };
      return context;

    }

    //if user role is 3 we only want to allow the tenants they are authorized for. so we will force query params regardless of their query
    if(+userRole !== 1){

      const idArray = tenantIds;

      if((context.params.query).hasOwnProperty('id')){

        const idsInit = JSON.parse(context.params.query.id);

        let authIds;

        if(Array.isArray(idsInit)){

          authIds = idsInit.map( id => idArray.includes(id));

        } else{
          authIds = [idsInit];
        }

        if(!authIds.length){
          throw new Forbidden('Not Authorized');
        }

        context.params.query = {
          id: authIds
        };
      } else {
        context.params.query = {
          id: idArray
        };
      }

    }

    context.params.query = {
      ...context.params.query,
      $select: ['id', 'name', 'timeZone', 'tenantCode'],
      $sort: {
        name: 1
      }
    };

    return context;
  };
};

exports.tenantGetAuth = function () {
  return async context => {

    const recordId = +context.id;

    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole } = context.params.user;

    //if user role is 3 we only want to allow the tenants they are authorized for. if they request a get on unauthorized tenant id throw error
    if(+userRole !== 1){
      context.params.query = {};
      const {tenantIds} = context.params.user;
      if(!tenantIds.includes(recordId)){
        throw new Forbidden('Not Authorized to get this record.');
      }
    }

    return context;
  };
};

exports.tenantUpdateAuth = function () {
  return async context => {

    const {userRole, tenantIds} = context.params.user;
    const recordId = context.id;

    if(+userRole === 3){
      if(!tenantIds.includes(+recordId)){
        throw new Forbidden('You do not have permission to update this tenant!');
      }
    }

    if(context.data.hasOwnProperty('tenantCode')){
      throw new Forbidden('You Cannot Modify the Tenant Code!');
    }

    return context;
  };
};


exports.validateCreate = function (){
  return validate.form(schema_CREATE, joiOptions);
};

exports.validateUpdate = function () {
  return validate.form(schema_UPDATE, joiOptions);
};
