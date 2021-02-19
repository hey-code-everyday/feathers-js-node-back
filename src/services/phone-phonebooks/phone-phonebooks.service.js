// Initializes the `phone-phonebooks` service on path `/phone-phonebooks`
const createService = require('feathers-sequelize');
const createModel = require('../../models/phone-phonebooks.model');
const hooks = require('./phone-phonebooks.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true,
    multi: ['create']
  };

  // Initialize our service with any options it requires
  app.use('/phone-phonebooks', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('phone-phonebooks');

  service.hooks(hooks);
};
