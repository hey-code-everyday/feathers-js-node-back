// Initializes the `queuemembers` service on path `/queuemembers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/queuemembers.model');
const hooks = require('./queuemembers.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/queuemembers', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('queuemembers');

  service.hooks(hooks);
};
