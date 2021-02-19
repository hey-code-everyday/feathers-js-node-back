// Initializes the `queue-managers` service on path `/queue-managers`
const { QueueManagers } = require('./queue-managers.class');
const createModel = require('../../models/queue-managers.model');
const hooks = require('./queue-managers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: ['create', 'remove']
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/queue-managers', new QueueManagers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('queue-managers');

  service.hooks(hooks);
};
