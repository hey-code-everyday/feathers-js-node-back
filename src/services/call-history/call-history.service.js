const { CallHistory } = require('./call-history.class');
const createModel = require('../../models/call-reports.model');
const hooks = require('./call-history.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/call-history', new CallHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('call-history');

  service.hooks(hooks);
};
