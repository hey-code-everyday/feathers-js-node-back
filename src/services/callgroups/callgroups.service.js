// Initializes the `callgroups` service on path `/callgroups`
const { Callgroups } = require('./callgroups.class');
const createModel = require('../../models/callgroups.model');
const hooks = require('./callgroups.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/callgroups', new Callgroups(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('callgroups');

  service.hooks(hooks);
};
