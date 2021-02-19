exports.resolverGet = {
  joins: {
    parkingLot: () => async (tenant, context) => {
      const lots = await context.app.service('parkinglots')._find({paginate: false, query: {tenantId: tenant.id}});
      tenant.parkingLot = lots[0];
    },
    settings: () => async (tenant, context) => {
      tenant.settings = await context.app.service('tenant-settings')._find({paginate: false, query: {tenantId: tenant.id}});
    },
    extensions: () => async (tenant, context) => {
      const extensions = await context.app.service('extensions')._find({paginate: false, query: {tenantId: tenant.id}});
      tenant.extensionsCount = extensions.length;
    },
    dids: () => async (tenant, context) => {
      const dids = await context.app.service('dids')._find({query: {tenantId: tenant.id}});
      tenant.didsCount = dids.total;
    },
    users: () => async (tenant, context) => {
      const users = await context.app.service('users')._find({query: {tenantId: tenant.id}});
      tenant.usersCount = users.total;
    }
  },
};
