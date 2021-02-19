const { PhonebookDetails } = require('./phonebook-details.class');
const createModel = require('../../models/phonebook-details.model');
const hooks = require('./phonebook-details.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true,
    multi: ['create', 'remove', 'patch']
  };

  // Initialize our service with any options it requires
  app.use('/phonebook-details', new PhonebookDetails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('phonebook-details');

  service.hooks(hooks);
};
