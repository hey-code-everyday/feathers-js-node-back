const { SbcManagement } = require('./sbc-management.class');
const hooks = require('./sbc-management.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sbc-management', new SbcManagement(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sbc-management');

  service.hooks(hooks);
};
