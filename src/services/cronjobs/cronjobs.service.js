// Initializes the `cronjobs` service on path `/cronjobs`
const createService = require('feathers-sequelize');
const createModel = require('../../models/cronjobs.model');
const hooks = require('./cronjobs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/cronjobs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('cronjobs');

  service.hooks(hooks);
};
