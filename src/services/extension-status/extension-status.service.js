// Initializes the `extension-status` service on path `/extension-status`
const { ExtensionStatus } = require('./extension-status.class');
const createModel = require('../../models/extension-status.model');
const hooks = require('./extension-status.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');

  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/extension-status', new ExtensionStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('extension-status');

  service.hooks(hooks);
};
