// Initializes the `locations` service on path `/locations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/locations.model');
const hooks = require('./locations.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/locations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('locations');

  service.hooks(hooks);
};
