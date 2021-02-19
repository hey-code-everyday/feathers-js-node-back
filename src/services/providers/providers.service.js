// Initializes the `providers` service on path `/providers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/providers.model');
const hooks = require('./providers.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/providers', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('providers');

  service.hooks(hooks);
};
