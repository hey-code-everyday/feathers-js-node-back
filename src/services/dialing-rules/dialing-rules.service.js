// Initializes the `dialing-rules` service on path `/dialing-rules`
const createService = require('feathers-sequelize');
const createModel = require('../../models/dialing-rules.model');
const hooks = require('./dialing-rules.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/dialing-rules', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dialing-rules');

  service.hooks(hooks);
};
