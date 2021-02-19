const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.CDR = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('call-detail-records').find({
        paginate: false,
        query: {
          uniqueId: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, cdr => cdr.uniqueId, '[]');
    }, {context});
  },
  joins: {
    cdr: () => async (record, context) => {
      const cdrs = await context._loaders.CDR.load(record.uniqueId);
      record.callerName = cdrs ? cdrs[0].callerId : null;
    },
    direction: () => async (record, context) => {
      if (record.direction === 'IN') {
        record.direction = 'inbound';
      }
      if (record.direction === 'OUT') {
        record.direction = 'outbound';
      }
      if (record.direction === 'INTERNAL') {
        const extension = context.params.user.myExtension.number;
        const {dialedNum} = record;
        record.direction = +dialedNum === +extension ? 'inbound' : 'outbound';
      }
    }
  }
};
