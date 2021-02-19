// Initializes the `mediafiles` service on path `/mediafiles`
const createService = require('feathers-sequelize');
const createModel = require('../../models/mediafiles.model');
const hooks = require('./mediafiles.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/mediafiles', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('mediafiles');

  service.hooks(hooks);
};
