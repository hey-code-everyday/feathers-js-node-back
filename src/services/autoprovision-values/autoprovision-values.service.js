// Initializes the `autoprovision-values` service on path `/autoprovision-values`
const createService = require('feathers-sequelize');
const createModel = require('../../models/autoprovision-values.model');
const hooks = require('./autoprovision-values.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/autoprovision-values', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('autoprovision-values');

  service.hooks(hooks);
};
