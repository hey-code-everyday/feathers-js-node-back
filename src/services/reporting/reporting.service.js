// Initializes the `reporting` service on path `/reporting`
const createService = require('./reporting.class.js');
const hooks = require('./reporting.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {};

  // Initialize our service with any options it requires
  app.use('/reporting', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('reporting');

  service.hooks(hooks);
};
