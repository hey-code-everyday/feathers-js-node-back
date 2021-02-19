// Initializes the `device-models` service on path `/device-models`
const createService = require('feathers-sequelize');
const createModel = require('../../models/device-models.model');
const hooks = require('./device-models.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/device-models', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('device-models');

  service.hooks(hooks);
};
