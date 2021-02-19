const {BadRequest, Forbidden} = require('@feathersjs/errors');

exports.validateOrderViewAuth = function () {
  return async context => {

    const {userRole} = context.params.user;
    const {orderRef} = context.params.query;

    if (+userRole !== 1) {

      const idArray = context.params.user.tenantIds;

      if (!orderRef) {
        throw new BadRequest('You Must Specify An Order Reference Number!');
      }

      //find the matching tenant
      let TenantRecord = null;
      const tenant = await context.app.service('tenants')._find({query: {tenantCode: orderRef}});
      if (tenant.length) {
        TenantRecord = tenant[0];
      }

      if (TenantRecord === null) {
        throw new BadRequest('Tenant Does Not Exist for This Order Reference!');
      }

      const tenantId = TenantRecord.id;
      if (!idArray.includes(+tenantId)) {
        throw new Forbidden('You Do Not Have Permission For This Tenant!');
      }

    }

    //if no order reference param passed for level 1 user just set to return all orders
    if (!orderRef) {
      context.params.query.orderRef = '';
    }

    return context;
  };
};

exports.getPortOrderAuth = function () {
  return async context => {

    const orderRef = context.result.customerOrderReference;
    const tenantCode = orderRef.split('-')[0];
    const {userRole} = context.params.user;

    if (+userRole !== 1) {

      let TenantRecord = null;
      const tenant = await context.app.service('tenants')._find({query: {tenantCode}});
      if (tenant.length) {
        TenantRecord = tenant[0];
      }

      //this should never happen
      if (TenantRecord === null) {
        throw new BadRequest('A Tenant Does Not Exist For this Order ID');
      }

      const idArray = context.params.user.tenantIds;

      const tenantId = TenantRecord.id;

      if (!idArray.includes(+tenantId)) {
        throw new Forbidden('You Do Not Have Permission For This Tenant!');
      }

    }

    return context;
  };
};
