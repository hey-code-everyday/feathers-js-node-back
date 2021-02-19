const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.customTypes = new BatchLoader( async(keys, context) => {
      const result = await context.app.service('custom-types')._find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, customType => customType.id, '');
    }, {context});
  },
  joins: {
    customTypes: () => async (custom, context) => {
      const types = await context._loaders.customTypes.load(custom.cu_ct_id);
      custom.customType = types ? types : null;
    }
  }
};
