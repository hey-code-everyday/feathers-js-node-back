const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (huntlist, context) => {
      huntlist.de_destinations = await context.app.service('destinations').find({
        paginate: false,
        query: {
          tenantId: huntlist.tenantId,
          de_type_src: deRef.HUNTLIST,
          typeIdSrc: huntlist.id
        }
      });
    }
  }
};
