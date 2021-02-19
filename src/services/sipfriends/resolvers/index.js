const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.sipfriendResolvers = {
  before: context => {
    context._loaders.status = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('extension-status')._find({
        paginate: false,
        query: {
          extension: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, status => status.extension, '');
    }, {context});
  },
  joins: {
    sipStatus: () => async (sipfriend, context) => {
      const results = await context._loaders.status.load(sipfriend.name);
      sipfriend.sipStatus = 'UNAVAILABLE';
      if (results) {
        sipfriend.sipStatus = results.state;
        sipfriend.hostServer = results.server;
      }
    }
  }
};
