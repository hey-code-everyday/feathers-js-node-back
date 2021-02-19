// Initializes the `dids` service on path `/dids`
const createService = require('feathers-sequelize');
const createModel = require('../../models/dids.model');
const hooks = require('./dids.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    multi: ['create'],
    paginate: app.get('paginate'),
    raw: true,
  };

  // Initialize our service with any options it requires
  app.use('/dids', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dids');

  service.hooks(hooks);
};
