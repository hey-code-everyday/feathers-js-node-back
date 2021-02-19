// Initializes the `channel-memberships` service on path `/channel-memberships`
const { ChannelMemberships } = require('./channel-memberships.class');
const hooks = require('./channel-memberships.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/channel-memberships', new ChannelMemberships(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('channel-memberships');

  //disable the created event
  service.publish('created', () => null);

  //custom event publishing for ami events
  service.publish('extensionStatus', data => {
    const channelName = `${data.roomType}/${data.tenantCode}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('directoryExtensionStatus', data => {
    const channelName = `${data.roomType}/${data.tenantCode}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('newVoicemail', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('notifyNewCall', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('notifyExtStatus', data => {
    const channelName = `${data.roomType}/${data.tenantCode}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueSummary', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueMemberPause', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueRefresh', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueCallerJoin', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueCallerLeave', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueEntry', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('queueCallerConnected', data => {
    const channelName = `${data.roomType}/${data.queueId}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('dndStatus', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('myPresence', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('notifyActiveCall', data => {
    const channelName = `${data.roomType}/${data.tenantCode}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('notifyUserActiveCall', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('atxferMergeComplete', data => {
    const channelName = `${data.roomType}/${data.peerName}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('conferenceChannel', data => {
    const channelName = data.socketChannel;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('conferenceInfoComplete', data => {
    const channelName = data.socketChannel;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.publish('newFax', data => {
    const channelName = `${data.roomType}/${data.email}`;
    if(app.channels.includes(channelName)){
      if(app.channel(channelName).length){
        return app.channel(channelName);
      }
    }
  });

  service.hooks(hooks);
};
