// Initializes the `meetmes` service on path `/meetmes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/meetmes.model');
const hooks = require('./meetmes.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/meetmes', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('meetmes');

  service.hooks(hooks);
};
