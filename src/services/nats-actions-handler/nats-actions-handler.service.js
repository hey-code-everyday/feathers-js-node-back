// Initializes the `nats-actions-handler` service on path `/nats-actions-handler`
const { NatsActionsHandler } = require('./nats-actions-handler.class');
const hooks = require('./nats-actions-handler.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/nats-actions-handler', new NatsActionsHandler(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('nats-actions-handler');

  service.hooks(hooks);
};
