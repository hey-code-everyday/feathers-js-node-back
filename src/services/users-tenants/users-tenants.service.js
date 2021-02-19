// Initializes the `users-tenants` service on path `/users-tenants`
const { UsersTenants } = require('./users-tenants.class');
const createModel = require('../../models/users-tenants.model');
const hooks = require('./users-tenants.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: ['create', 'remove'],
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/users-tenants', new UsersTenants(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('users-tenants');

  service.hooks(hooks);
};
