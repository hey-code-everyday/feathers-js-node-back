// Initializes the `huntlists` service on path `/huntlists`
const createService = require('feathers-sequelize');
const createModel = require('../../models/huntlists.model');
const hooks = require('./huntlists.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/huntlists', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('huntlists');

  service.hooks(hooks);
};
