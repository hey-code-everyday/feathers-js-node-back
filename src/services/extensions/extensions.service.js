// Initializes the `extensions` service on path `/extensions`
const { Extensions } = require('./extensions.class');
const createModel = require('../../models/extensions.model');
const hooks = require('./extensions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/extensions', new Extensions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('extensions');

  service.publish((event) => {
    const {peerName} = event;
    const tenantCode = peerName.split('-')[1];
    const channelName = `extensions/${tenantCode}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.hooks(hooks);

};
