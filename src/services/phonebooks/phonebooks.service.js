// Initializes the `Phonebooks` service on path `/phonebooks`
const createService = require('feathers-sequelize');
const createModel = require('../../models/phonebooks.model');
const hooks = require('./phonebooks.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/phonebooks', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('phonebooks');

  service.hooks(hooks);
};
