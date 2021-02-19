const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (paginggroup, context) => {
      paginggroup.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: paginggroup.tenantId,
          de_type_src: deRef.PAGINGGROUP,
          typeIdSrc: paginggroup.id
        }
      });
    }
  }
};
