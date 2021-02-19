// Initializes the `donotcalls` service on path `/donotcalls`
const { Donotcalls } = require('./donotcalls.class');
const createModel = require('../../models/donotcalls.model');
const hooks = require('./donotcalls.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/donotcalls', new Donotcalls(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('donotcalls');

  service.hooks(hooks);
};
