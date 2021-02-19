// Initializes the `campaigns` service on path `/campaigns`
const createService = require('feathers-sequelize');
const createModel = require('../../models/campaigns.model');
const hooks = require('./campaigns.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/campaigns', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('campaigns');

  service.hooks(hooks);
};
