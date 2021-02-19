// Initializes the `conditions` service on path `/conditions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/conditions.model');
const hooks = require('./conditions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/conditions', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('conditions');

  service.hooks(hooks);
};
