// Initializes the `paging-groups` service on path `/paging-groups`
const createService = require('feathers-sequelize');
const createModel = require('../../models/paging-groups.model');
const hooks = require('./paging-groups.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/paging-groups', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('paging-groups');

  service.hooks(hooks);
};
