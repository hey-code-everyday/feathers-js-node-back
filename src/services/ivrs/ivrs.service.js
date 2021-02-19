// Initializes the `ivrs` service on path `/ivrs`
const createService = require('feathers-sequelize');
const createModel = require('../../models/ivrs.model');
const hooks = require('./ivrs.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/ivrs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('ivrs');

  service.hooks(hooks);
};
