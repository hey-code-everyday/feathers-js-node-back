// Initializes the `features` service on path `/features`
const createService = require('feathers-sequelize');
const createModel = require('../../models/features.model');
const hooks = require('./features.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/features', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('features');

  service.hooks(hooks);
};
