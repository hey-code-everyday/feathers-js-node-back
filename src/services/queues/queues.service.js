// Initializes the `queues` service on path `/queues`
const { Queues } = require('./queues.class');
const createModel = require('../../models/queues.model');
const hooks = require('./queues.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    events: ['requestQueueStatus', 'queueLogin', 'queueLogout', 'queuePause', 'queueUnpause', 'refreshQueueConnected'],
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/queues', new Queues(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('queues');

  service.hooks(hooks);
};
