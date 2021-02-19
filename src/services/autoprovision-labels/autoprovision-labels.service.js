// Initializes the `autoprovision-labels` service on path `/autoprovision-labels`
const createService = require('feathers-sequelize');
const createModel = require('../../models/autoprovision-labels.model');
const hooks = require('./autoprovision-labels.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/autoprovision-labels', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('autoprovision-labels');

  service.hooks(hooks);
};
