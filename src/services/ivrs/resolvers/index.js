const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (ivr, context) => {
      ivr.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: ivr.tenantId,
          de_type_src: deRef.IVR,
          typeIdSrc: ivr.id
        }
      });
    }
  }
};
