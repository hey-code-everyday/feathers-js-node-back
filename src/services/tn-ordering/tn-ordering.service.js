// Initializes the `tn-ordering` service on path `/tn-ordering`
const createService = require('./tn-ordering.class.js');
const hooks = require('./tn-ordering.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/tn-ordering', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('tn-ordering');

  service.hooks(hooks);
};
