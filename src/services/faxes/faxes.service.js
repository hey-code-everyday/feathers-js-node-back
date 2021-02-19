// Initializes the `faxes` service on path `/faxes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/faxes.model');
const hooks = require('./faxes.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/faxes', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('faxes');

  service.hooks(hooks);
};
