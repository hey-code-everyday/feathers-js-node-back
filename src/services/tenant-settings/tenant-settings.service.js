// Initializes the `tenant-settings` service on path `/tenant-settings`
const { TenantSettings } = require('./tenant-settings.class');
const createModel = require('../../models/tenant-settings.model');
const hooks = require('./tenant-settings.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: ['create'],
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/tenant-settings', new TenantSettings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenant-settings');

  service.hooks(hooks);
};
