const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.phonebooks = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('phonebooks')._find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, entry => entry.id, '');
    }, {context});
  },
  joins: {
    phonebook: () => async (entry, context) => {
      const entries = await context._loaders.phonebooks.load(entry.phonebookId);
      entry.phonebookIncludeExt = entries ? entries.includeExt : 'no';
    }
  }
};
