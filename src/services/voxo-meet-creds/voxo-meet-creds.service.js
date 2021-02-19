// Initializes the `voxo-meet-creds` service on path `/voxo-meet-creds`
const { VoxoMeetCreds } = require('./voxo-meet-creds.class');
const hooks = require('./voxo-meet-creds.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/voxo-meet-creds', new VoxoMeetCreds(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('voxo-meet-creds');

  service.hooks(hooks);
};
