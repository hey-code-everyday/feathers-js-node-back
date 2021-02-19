// Initializes the `pickupgroups` service on path `/pickupgroups`
const { Pickupgroups } = require('./pickupgroups.class');
const createModel = require('../../models/pickupgroups.model');
const hooks = require('./pickupgroups.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pickupgroups', new Pickupgroups(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pickupgroups');

  service.hooks(hooks);
};
