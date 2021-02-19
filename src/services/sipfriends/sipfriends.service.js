// Initializes the `sipfriends` service on path `/sipfriends`
const createService = require('feathers-sequelize');
const createModel = require('../../models/sipfriends.model');
const hooks = require('./sipfriends.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/sipfriends', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('sipfriends');

  service.hooks(hooks);
};
