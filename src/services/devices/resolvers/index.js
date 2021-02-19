const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

exports.resolverFind = {
  before: context => {
    context._loaders.tenant = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('tenants').find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, tenant => tenant.id, '');
    }, {context});

    context._loaders.extension = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('extensions').find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, extension => extension.id, '');
    }, {context});

    context._loaders.deviceModel = new BatchLoader(async (keys, context) => {
      const result = await context.app.service('device-models').find({
        paginate: false,
        query: {
          id: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, deviceModel => deviceModel.id, '');
    }, {context});

    context._loaders.phoneBooks = new BatchLoader(async(keys, context) => {
      const result = await context.app.service('phone-phonebooks')._find({
        paginate: false,
        query: {
          deviceId: {$in: getUniqueKeys(keys)}
        }
      });
      return getResultsByKey(keys, result, phonebook => phonebook.deviceId, '[]');
    }, {context});
  },
  joins: {
    tenant: () => async (device, context) => {
      const tenant = await context._loaders.tenant.load(device.tenantId);
      if (tenant) {
        device.tenantName = tenant.name;
        device.tenantCode = tenant.tenantCode;
      }
    },
    extension: () => async (device, context) => {
      const extension = await context._loaders.extension.load(device.ph_line1_ex_id);
      if (extension) {
        const {name, number, peerName} = extension;
        device.extension = {name, number, peerName};
      }
    },
    deviceModel: () => async (device, context) => {
      const model = await context._loaders.deviceModel.load(device.ph_pm_id);
      device.deviceModel = model ? model.name : '';
    },
    phoneBookIds: () => async (device, context) => {
      const model = await context._loaders.phoneBooks.load(device.id);
      device.phonebookIds = model ? model.map( item => item.phonebookId) : [];
    }
  }
};


exports.resolverGet = {
  joins: {
    tenant: () => async (device, context) => {
      const tenant = await context.app.service('tenants')._find({paginate: false, query: {id: device.tenantId}});
      device.tenantName = tenant[0].name;
      device.tenantCode = tenant[0].tenantCode;
    },
    extension: () => async (device, context) => {
      const extension = await context.app.service('extensions').find({paginate: false, query: {id: device.ph_line1_ex_id}});
      if (extension.length) {
        const {name, number, peerName} = extension[0];
        device.extension = {name, number, peerName};
      }
    },
    deviceModel: () => async (device, context) => {
      const model = await context.app.service('device-models')._get(device.ph_pm_id);
      device.deviceModel = model ? model : null;
    }
  }
};
