// Initializes the `call-blocking` service on path `/call-blocking`
const createService = require('feathers-sequelize');
const createModel = require('../../models/call-blocking.model');
const hooks = require('./call-blocking.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/call-blocking', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('call-blocking');

  service.hooks(hooks);
};
