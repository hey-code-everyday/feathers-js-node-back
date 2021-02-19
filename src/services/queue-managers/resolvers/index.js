const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.managers = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('users')._find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, manager => manager.id, '');
    }, {context});
  },
  joins: {
    managers: () => async (record, context) => {
      //we are checking for doing fastjoins to avoid infinite loops on join services.
      const results = await context._loaders.managers.load(record.userId);
      if (results) {
        record.userEmail = results.email;
        record.userRole = results.userRole;
        record.receiveReports = results.receiveQueueReports;
      }
    }
  }
};
