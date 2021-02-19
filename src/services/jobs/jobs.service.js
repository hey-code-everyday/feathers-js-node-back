// Initializes the `jobs` service on path `/jobs`
const { Jobs } = require('./jobs.class');
const hooks = require('./jobs.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/jobs', new Jobs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('jobs');

  service.publish( () => null);

  service.hooks(hooks);
};
