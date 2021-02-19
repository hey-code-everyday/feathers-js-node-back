// Initializes the `voicemail-messages` service on path `/voicemail-messages`
const createService = require('feathers-sequelize');
const createModel = require('../../models/voicemail-messages.model');
const hooks = require('./voicemail-messages.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/voicemail-messages', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('voicemail-messages');

  //disable real time events
  service.publish(() => null);

  service.hooks(hooks);
};
