// Initializes the `password-reset` service on path `/password-reset`
const { PasswordReset } = require('./password-reset.class');
const hooks = require('./password-reset.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/password-reset', new PasswordReset(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('password-reset');

  service.hooks(hooks);
};
