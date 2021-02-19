const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (campaign, context) => {
      campaign.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: campaign.tenantId, de_type_src: deRef.CAMPAIGN, typeIdSrc: campaign.id
        }
      });
    }
  }
};
