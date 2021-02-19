exports.tenantIdToCode = function () {
  return async context => {

    const { tenantId } = context.params.query;
    const tenantService = context.app.service('tenants');
    const { tenantCode } = await tenantService._get(tenantId);

    context.params.query = {
      ...context.params.query,
      tenantCode
    };

    return context;
  };
};
