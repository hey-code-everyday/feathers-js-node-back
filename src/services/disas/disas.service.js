// Initializes the `disas` service on path `/disas`
const createService = require('feathers-sequelize');
const createModel = require('../../models/disas.model');
const hooks = require('./disas.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');

  const options = {
    Model: createModel(app),
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/disas', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('disas');

  service.hooks(hooks);
};
