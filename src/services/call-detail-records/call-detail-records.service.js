// Initializes the `call-detail-records` service on path `/call-detail-records`
const { CallDetailRecords } = require('./call-detail-records.class');
const createModel = require('../../models/call-detail-records.model');
const hooks = require('./call-detail-records.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/call-detail-records', new CallDetailRecords(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('call-detail-records');

  service.hooks(hooks);
};
