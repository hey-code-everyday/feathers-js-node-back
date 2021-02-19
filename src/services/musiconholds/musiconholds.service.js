// Initializes the `musiconholds` service on path `/musiconholds`
const createService = require('feathers-sequelize');
const createModel = require('../../models/musiconholds.model');
const hooks = require('./musiconholds.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/musiconholds', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('musiconholds');

  service.hooks(hooks);
};
