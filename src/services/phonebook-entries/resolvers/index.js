const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.phonebookDetails = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('phonebook-details').find({
        paginate: false,
        query: {
          phonebookEntryId: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, entry => entry.phonebookEntryId, '[]');
    }, {context});
  },
  joins: {
    details: () => async (entry, context) => {
      const entries = await context._loaders.phonebookDetails.load(entry.id);

      let detailsObject = {};
      const {phonebookItemKeys} = context;
      entry.hasDetails = false;

      for(let i = 0; i<phonebookItemKeys.length; i++){
        detailsObject[phonebookItemKeys[i]] = '';
        entry[phonebookItemKeys[i]] = '';
      }

      if(entries){
        for(let i = 0; i<entries.length; i++){
          detailsObject[entries[i].itemCode] = entries[i].phonebookItemValue;
          entry[entries[i].itemCode] = entries[i].phonebookItemValue;
          entry.hasDetails = true;
        }
        entry.nameNumber = `${entry.NAME} - ${entry.PHONE1}`;
      }
    }
  }
};
