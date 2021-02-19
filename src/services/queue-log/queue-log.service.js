const { QueueLog } = require('./queue-log.class');
const createModel = require('../../models/queue-log.model');
const hooks = require('./queue-log.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/queue-log', new QueueLog(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('queue-log');

  service.hooks(hooks);
};
