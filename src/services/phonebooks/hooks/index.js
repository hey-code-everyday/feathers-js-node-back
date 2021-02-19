const groupBy = require('lodash/groupBy');
const {BadRequest} = require('@feathersjs/errors');

exports.addPhonebookToDevices = function () {
  return async context => {

    const {myExtension, email} = context.params.user;

    if(!myExtension){

      const extension = await context.app.service('extensions')._find({
        paginate: false,
        query: {
          email
        }
      });
      if(!extension.length){
        throw new BadRequest('You Have No Extension Assigned to Your User!');
      }

      const extensionId = extension[0].id;
      const extensionTenant = extension[0].tenantId;

      const devices = await context.app.service('devices')._find({
        paginate: false,
        query: {
          ph_line1_ex_id: extensionId
        }
      });
      const deviceIds = devices.map( device => device.id );

      context.params.user.myExtension = {
        tenantId: extensionTenant,
        devices: deviceIds
      };
    }


    //this will look at the users device ids for their extension and add the entry to phonephonebooks for each device
    const {devices, tenantId} = context.params.user.myExtension;
    const phonebookId = context.result.id;

    //we have to determine the appropriate order so let's query each devices phonebooks and determine the highest exsiting order
    const devicePhonebooks = await context.app.service('phone-phonebooks').find({
      paginate: false,
      query: {
        deviceId: {$in: devices}
      }
    });

    //phonebooks with include extension must come last
    const groupedByIncludeExt = groupBy(devicePhonebooks, 'phonebookIncludeExt');

    let includeExtPhonebooks = [];
    let otherPhonebooks = [];

    if(groupedByIncludeExt.hasOwnProperty('yes')){
      includeExtPhonebooks = groupedByIncludeExt['yes'];
    }

    if(groupedByIncludeExt.hasOwnProperty('no')){
      otherPhonebooks = groupedByIncludeExt['no'];
    }

    //start with otherPhonebooks and build up the orders
    const groupOtherByDevice = groupBy(otherPhonebooks, 'deviceId');

    //determine the order of the new custom book
    let createArray = [];
    let orderArray = [];
    let order;
    for(let deviceId of devices){
      if(groupOtherByDevice.hasOwnProperty(deviceId)){

        orderArray = [];
        order = 1;
        //built the array of orders from each results
        for(let i = 0; i<groupOtherByDevice[deviceId].length; i++){
          orderArray.push(groupOtherByDevice[deviceId][i].order);
        }

        //figure out the max in this array to assign highest order to new phonebook
        if(orderArray.length){
          const maxOrder = Math.max(...orderArray);
          order = maxOrder + 1;
        }

        //add to our creation array
        createArray.push({
          tenantId,
          deviceId,
          phonebookId,
          order
        });

      }else{
        createArray.push({
          tenantId,
          deviceId,
          phonebookId,
          order: 1
        });
      }
    }

    //create new entries (don't think I need to wait on this)
    context.app.service('phone-phonebooks').create(createArray);

    //reorder the existing phonebooks with includeExt. really just need to add 1 to each because we are simply adding a single new phonebook
    const groupIncludeExt = groupBy(includeExtPhonebooks, 'deviceId');
    for(let deviceId in groupIncludeExt){
      if(groupIncludeExt.hasOwnProperty(deviceId)){
        for(let i = 0; i<groupIncludeExt[deviceId].length; i++){
          context.app.service('phone-phonebooks')._patch(groupIncludeExt[deviceId][i].id, {
            order: groupIncludeExt[deviceId][i]['order'] + 1
          });
        }
      }
    }

    return context;
  };
};

exports.createPhonebookLayout = function () {
  return async context => {

    //service we need
    const phonebookId = context.result.id;
    const {myExtension, email} = context.params.user;

    if(!myExtension){
      const extension = await context.app.service('extensions')._find({
        paginate: false,
        query: {
          email
        }
      });
      if(!extension.length){
        throw new BadRequest('User Has No Extension');
      }
      context.params.user.myExtension = {
        tenantId: extension[0].tenantId
      };
    }


    const {tenantId} = context.params.user.myExtension;

    //we need to get the phonebookIds for our keys we are intersted in and just create the default entries
    const phonebookItems = await context.app.service('phonebook-items').find({paginate: false});

    const keyNames = ['NAME', 'FIRSTNAME', 'LASTNAME', 'PHONE1', 'EMAIL', 'COMPANY'];
    const orderRef = {
      NAME: 1,
      PHONE1: 2,
      FIRSTNAME: 3,
      LASTNAME: 4,
      EMAIL: 5,
      COMPANY: 6
    };

    //build up our new entries based on our assumed defaults
    let createArray = [];

    for(let i = 0; i<phonebookItems.length; i++){
      if(keyNames.includes(phonebookItems[i].itemCode)){
        createArray.push({
          tenantId,
          phonebookId,
          phonebookItemsId: phonebookItems[i].id,
          order: orderRef[phonebookItems[i].itemCode]
        });
      }
    }

    //create the 5 entries in the phonebooklayouts table
    context.app.service('phonebook-layouts').create(createArray);

    return context;
  };
};

exports.emitUserUpdate = function () {
  return async context => {
    const recordId = context.result.id;
    const userId = context.params.user.id;
    context.app.service('users').emit('userPhonebookUpdate', {recordId, userId});
    return context;
  };
};

