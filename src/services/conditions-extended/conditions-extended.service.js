// Initializes the `conditions-extended` service on path `/conditions-extended`
const createService = require('feathers-sequelize');
const createModel = require('../../models/conditions-extended.model');
const hooks = require('./conditions-extended.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/conditions-extended', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('conditions-extended');

  service.hooks(hooks);
};
