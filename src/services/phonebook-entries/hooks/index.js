const {BadRequest} = require('@feathersjs/errors');

exports.checkPhonebookId = function () {
  return async context => {

    const {phonebookId} = context.params.query;

    if(!phonebookId){
      throw new BadRequest('You Must Provide a Phonebook ID!');
    }

    return context;
  };
};

exports.createEntryDetails = function () {
  return async context => {

    //first we need to query the items so we can insert proper ids to the phonebook details table
    //there will be five entries per contact created
    const pbItems = await context.app.service('phonebook-items').find({paginate: false});
    const keyNames = ['FIRSTNAME', 'LASTNAME', 'PHONE1', 'EMAIL', 'COMPANY'];
    const itemIdRef = {};
    for(let i = 0; i<pbItems.length; i++){
      if(keyNames.includes(pbItems[i].itemCode)){
        itemIdRef[pbItems[i].itemCode] = pbItems[i].id;
      }
      if(pbItems[i].itemCode === 'NAME') {
        itemIdRef[pbItems[i].itemCode] = pbItems[i].id;
      }
    }

    let detailEntries = [];
    let firstName = '';
    let lastName = '';

    //for a multiple we gotta run a loop
    if(Array.isArray(context.data)){
      for(let i = 0; i<context.data.length; i++){
        const entryDetails = context.data[i];

        //this guarantees the next odd increment is populated.
        const phonebookEntryId = context.result[i].id;
        const {tenantId} = context.result[i];

        detailEntries = [];

        for(let i = 0; i<keyNames.length; i++){
          detailEntries.push({
            tenantId,
            phonebookEntryId,
            phonebookItemId: itemIdRef[keyNames[i]],
            phonebookItemValue: entryDetails[keyNames[i]]
          });

          if(keyNames[i] === 'FIRSTNAME'){
            firstName = entryDetails[keyNames[i]];
          }

          if(keyNames[i] === 'LASTNAME'){
            lastName = entryDetails[keyNames[i]];
          }
        }

        //add the additional entry for the NAME details field
        detailEntries.push({
          tenantId,
          phonebookEntryId,
          phonebookItemId: itemIdRef['NAME'],
          phonebookItemValue: firstName.concat(' ', lastName)
        });

        //create the phonebook details entries.
        await context.app.service('phonebook-details').create(detailEntries);

      }
    } else{
      const entryDetails = context.data;
      const phonebookEntryId = context.result.id;
      const {tenantId} = context.result;

      detailEntries = keyNames.map( key => {
        return {
          tenantId,
          phonebookEntryId,
          phonebookItemId: itemIdRef[key],
          phonebookItemValue: entryDetails[key]
        };
      });

      //create the phonebook details entries.
      await context.app.service('phonebook-details').create(detailEntries);
    }

    return context;
  };
};


exports.loadPhonebookItems = function () {
  return async context => {

    const phonebookItems = await context.app.service('phonebook-items')._find({paginate: false});
    context.phonebookItemKeys = phonebookItems.map( item => item.itemCode);
    return context;

  };
};

//This hook queries newly inserted records because the proper auto-incremented ids are not returned accurately.
//We need the accurate ids because the entries are created and need the correct foreign key.
exports.queryNewlyInserted = function () {
  return async context => {

    const firstId = context.result[0].id;
    const {tenantId, phonebookId} = context.result[0];

    context.result = await context.app.service('phonebook-entries').find({
      paginate: false,
      query: {
        id: {$gte: firstId},
        tenantId,
        phonebookId
      }
    });

    return context;
  };
};

exports.removeEntryDetails = function () {
  return async context => {

    const phonebookEntryId = context.result.id;
    context.app.service('phonebook-details').remove(null, {
      query: {
        phonebookEntryId
      }
    });

    return context;
  };
};

exports.updateEntryDetails = function () {
  return async context => {

    const entryDetails = context.data;
    const {tenantId} = context.result;
    const phonebookEntryId = context.result.id;

    //remove old details
    await context.app.service('phonebook-details').remove(null, {
      query: {
        phonebookEntryId
      }
    });

    //create new details
    const pbItems = await context.app.service('phonebook-items').find({paginate: false});
    const keyNames = ['FIRSTNAME', 'LASTNAME', 'PHONE1', 'EMAIL', 'COMPANY'];
    const itemIdRef = {};
    for(let i = 0; i<pbItems.length; i++){
      if(keyNames.includes(pbItems[i].itemCode)){
        itemIdRef[pbItems[i].itemCode] = pbItems[i].id;
      }
      if(pbItems[i].itemCode === 'NAME') {
        itemIdRef[pbItems[i].itemCode] = pbItems[i].id;
      }
    }

    let detailEntries = [];
    let firstName = '';
    let lastName = '';

    for(let i = 0; i<keyNames.length; i++){
      detailEntries.push({
        tenantId,
        phonebookEntryId,
        phonebookItemId: itemIdRef[keyNames[i]],
        phonebookItemValue: entryDetails[keyNames[i]]
      });

      if(keyNames[i] === 'FIRSTNAME'){
        firstName = entryDetails[keyNames[i]];
      }

      if(keyNames[i] === 'LASTNAME'){
        lastName = entryDetails[keyNames[i]];
      }
    }

    //add the additional entry for the NAME details field
    detailEntries.push({
      tenantId,
      phonebookEntryId,
      phonebookItemId: itemIdRef['NAME'],
      phonebookItemValue: firstName.concat(' ', lastName)
    });

    //create the phonebook details entries.
    await context.app.service('phonebook-details').create(detailEntries);

    return context;
  };
};
