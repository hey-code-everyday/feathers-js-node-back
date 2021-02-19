// Initializes the `number-porting` service on path `/number-porting`
//This service is strictly for port order creation.
//see the port-in-orders service for existing order management.
const createService = require('./number-porting.class.js');
const hooks = require('./number-porting.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/number-porting', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('number-porting');

  service.hooks(hooks);
};
