// Initializes the `specials` service on path `/specials`
const createService = require('feathers-sequelize');
const createModel = require('../../models/specials.model');
const hooks = require('./specials.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/specials', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('specials');

  service.hooks(hooks);
};
