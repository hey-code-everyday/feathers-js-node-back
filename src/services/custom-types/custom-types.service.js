// Initializes the `custom-types` service on path `/custom-types`
const createService = require('feathers-sequelize');
const createModel = require('../../models/custom-types.model');
const hooks = require('./custom-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/custom-types', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('custom-types');

  service.hooks(hooks);
};
