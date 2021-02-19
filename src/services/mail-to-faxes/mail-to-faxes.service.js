const { MailToFaxes } = require('./mail-to-faxes.class');
const createModel = require('../../models/mail-to-faxes.model');
const hooks = require('./mail-to-faxes.hooks');

module.exports = function (app) {

  const options = {
    Model: createModel(app),
    paginate: false,
    raw: true
  };

  // Initialize our service with any options it requires
  app.use('/mail-to-faxes', new MailToFaxes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mail-to-faxes');

  service.hooks(hooks);
};
