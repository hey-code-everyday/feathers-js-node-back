// Initializes the `customs` service on path `/customs`
const createService = require('feathers-sequelize');
const createModel = require('../../models/customs.model');
const hooks = require('./customs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/customs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('customs');

  service.hooks(hooks);
};
