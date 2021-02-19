// Initializes the `routing-profiles` service on path `/routing-profiles`
const createService = require('feathers-sequelize');
const createModel = require('../../models/routing-profiles.model');
const hooks = require('./routing-profiles.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/routing-profiles', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('routing-profiles');

  service.hooks(hooks);
};
