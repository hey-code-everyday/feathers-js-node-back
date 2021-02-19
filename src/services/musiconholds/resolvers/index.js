const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (moh, context) => {
      moh.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: moh.tenantId,
          de_type_src: deRef.MUSICONHOLD,
          typeIdSrc: moh.id
        }

      });
    }
  }
};
