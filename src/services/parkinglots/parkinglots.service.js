// Initializes the `parkinglots` service on path `/parkinglots`
const createService = require('feathers-sequelize');
const createModel = require('../../models/parkinglots.model');
const hooks = require('./parkinglots.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/parkinglots', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('parkinglots');

  service.hooks(hooks);
};
