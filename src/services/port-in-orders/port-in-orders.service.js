// Initializes the `port-in-orders` service on path `/port-in-orders`
//this service is for order activation, cancellation, and editing
const createService = require('./port-in-orders.class.js');
const hooks = require('./port-in-orders.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/port-in-orders', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('port-in-orders');

  service.hooks(hooks);
};
