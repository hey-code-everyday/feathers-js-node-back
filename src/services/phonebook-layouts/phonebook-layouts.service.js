// Initializes the `phonebook-layouts` service on path `/phonebook-layouts`
const createService = require('feathers-sequelize');
const createModel = require('../../models/phonebook-layouts.model');
const hooks = require('./phonebook-layouts.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true,
    multi: ['create', 'remove']
  };

  // Initialize our service with any options it requires
  app.use('/phonebook-layouts', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('phonebook-layouts');

  service.hooks(hooks);
};
