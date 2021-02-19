// Initializes the `vox-reports` service on path `/vox-reports`
const createService = require('feathers-sequelize');
const createModel = require('../../models/vox-reports.model');
const hooks = require('./vox-reports.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/vox-reports', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('vox-reports');

  service.hooks(hooks);
};
