// Initializes the `call-reports` service on path `/call-reports`
const createService = require('feathers-sequelize');
const createModel = require('../../models/call-reports.model');
const hooks = require('./call-reports.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/call-reports', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('call-reports');

  service.hooks(hooks);
};
