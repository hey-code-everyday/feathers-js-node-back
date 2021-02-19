// Initializes the `tenants` service on path `/tenants`
const { Tenants } = require('./tenants.class');
const createModel = require('../../models/tenants.model');
const hooks = require('./tenants.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/tenants', new Tenants(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tenants');

  service.hooks(hooks);
};
