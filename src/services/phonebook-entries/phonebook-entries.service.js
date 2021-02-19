const { PhonebookEntries } = require('./phonebook-entries.class');
const createModel = require('../../models/phonebook-entries.model');
const hooks = require('./phonebook-entries.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true,
    multi: ['create', 'remove']
  };

  // Initialize our service with any options it requires
  app.use('/phonebook-entries', new PhonebookEntries(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('phonebook-entries');

  service.hooks(hooks);
};
