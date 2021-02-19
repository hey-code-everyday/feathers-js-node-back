const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (cron, context) => {
      cron.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: cron.tenantId, de_type_src: deRef.CRON, typeIdSrc: cron.id
        }
      });
    }
  }
};
