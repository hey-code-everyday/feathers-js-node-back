const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (flow, context) => {
      flow.de_destinations = await context.app.service('destinations').find(
        {
          query: {tenantId: flow.tenantId, de_type_src: deRef.FLOW, typeIdSrc: flow.id }
        }
      );
    }
  }
};
