// Initializes the `destinations` service on path `/destinations`
const createService = require('feathers-sequelize');
const createModel = require('../../models/destinations.model');
const hooks = require('./destinations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true,
    multi: ['remove'],
  };

  // Initialize our service with any options it requires
  app.use('/destinations', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('destinations');

  service.hooks(hooks);
};
