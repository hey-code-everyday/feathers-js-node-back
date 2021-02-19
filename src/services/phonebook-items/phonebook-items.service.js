
const { PhonebookItems } = require('./phonebook-items.class');
const createModel = require('../../models/phonebook-items.model');
const hooks = require('./phonebook-items.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/phonebook-items', new PhonebookItems(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('phonebook-items');

  service.hooks(hooks);
};
