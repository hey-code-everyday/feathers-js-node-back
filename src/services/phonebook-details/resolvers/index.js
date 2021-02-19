const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.phonebookItems = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('phonebook-items')._find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, item => item.id, '');
    }, {context});
  },
  joins: {
    details: () => async (detail, context) => {
      const items = await context._loaders.phonebookItems.load(detail.phonebookItemId);
      if(items){
        detail.itemCode = items.itemCode;
        detail.itemName = items.itemName;
      }
    }
  }
};
