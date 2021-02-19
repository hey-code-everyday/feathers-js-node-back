// Initializes the `asterisk-nodes` service on path `/asterisk-nodes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/asterisk-nodes.model');
const hooks = require('./asterisk-nodes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/asterisk-nodes', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('asterisk-nodes');

  service.hooks(hooks);
};
