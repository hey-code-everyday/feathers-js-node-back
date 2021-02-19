const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (feature, context) => {
      feature.de_destinations = await context.app.service('destinations').find({
        paginate: false,
        query: {
          tenantId: feature.tenantId,
          de_type_src: deRef.FEATURE,
          typeIdSrc: feature.id
        }
      });
    }
  }
};
