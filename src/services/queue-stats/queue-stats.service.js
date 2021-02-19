const { QueueStats } = require('./queue-stats.class');
const hooks = require('./queue-stats.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/queue-stats', new QueueStats(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('queue-stats');

  service.hooks(hooks);
};
