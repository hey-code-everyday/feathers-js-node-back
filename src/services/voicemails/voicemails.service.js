// Initializes the `voicemails` service on path `/voicemails`
const createService = require('feathers-sequelize');
const createModel = require('../../models/voicemails.model');
const hooks = require('./voicemails.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true,
    multi: ['patch'],
  };

  // Initialize our service with any options it requires
  app.use('/voicemails', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('voicemails');

  service.hooks(hooks);
};
