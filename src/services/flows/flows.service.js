// Initializes the `flows` service on path `/flows`
const createService = require('feathers-sequelize');
const createModel = require('../../models/flows.model');
const hooks = require('./flows.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/flows', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('flows');

  service.hooks(hooks);
};
