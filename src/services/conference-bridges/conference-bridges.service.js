// Initializes the `conference-bridges` service on path `/conference-bridges`
const createService = require('feathers-sequelize');
const createModel = require('../../models/conference-bridges.model');
const hooks = require('./conference-bridges.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/conference-bridges', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('conference-bridges');

  service.hooks(hooks);
};
