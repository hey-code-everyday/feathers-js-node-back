// Initializes the `inteliquent-webhooks` service on path `/inteliquent-webhooks`
const createService = require('./inteliquent-webhooks.class.js');
const hooks = require('./inteliquent-webhooks.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/inteliquent-webhooks', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('inteliquent-webhooks');

  service.hooks(hooks);
};
