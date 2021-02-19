const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (condition, context) => {
      condition.de_destinations = await context.app.service('destinations')._find({
        paginate: false,
        query: {
          tenantId: condition.tenantId, de_type_src: deRef.CONDITION, typeIdSrc: condition.id
        }
      });
    },
    conditionParams: () => async (condition, context) => {
      const params = await context.app.service('conditions-extended')._find({
        paginate: false,
        query: {
          ce_co_id: condition.id
        }
      });
      condition.params = params.length ? params : null;
    }
  }
};
