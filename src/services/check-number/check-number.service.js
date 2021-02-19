// Initializes the `check-number` service on path `/check-number`
const createService = require('./check-number.class.js');
const hooks = require('./check-number.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {};

  // Initialize our service with any options it requires
  app.use('/check-number', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('check-number');

  service.hooks(hooks);
};
