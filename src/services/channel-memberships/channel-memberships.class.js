/* eslint-disable no-unused-vars */
exports.ChannelMemberships = class ChannelMemberships {
  constructor (options) {
    this.options = options || {};
    this.events = ['extensionStatus', 'directoryExtensionStatus', 'newVoicemail', 'newFax', 'notifyNewCall',
      'notifyExtStatus', 'queueSummary', 'queueMemberPause', 'queueRefresh',
      'queueCallerJoin', 'queueCallerLeave', 'queueEntry', 'queueCallerConnected', 'atxferMergeComplete',
      'dndStatus', 'myPresence', 'notifyActiveCall', 'notifyUserActiveCall', 'refreshedCall',
      'conferenceChannel', 'conferenceInfoComplete'];
  }

  setup(app){
    this.app = app;
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {

    const { roomType, tenantId, tenantCode, extension, queueId, peerName, bridgeId, server, email } = data;

    if(params.connection){

      if(roomType === 'extensions'){
        const channelName = `${roomType}/${tenantCode}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

      if(roomType === 'omnia'){
        const peerName = `${extension}-${tenantCode}`;
        const channelName = `${roomType}/${peerName}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

      if(roomType === 'queues'){
        const channelName = `${roomType}/${queueId}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

      if(roomType === 'user'){
        const channelName = `${roomType}/${peerName}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

      if(roomType === 'conferences'){
        const channelName = `${roomType}/${server}/${bridgeId}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

      if(roomType === 'faxes'){
        const channelName = `${roomType}/${email}`;
        this.app.channel(channelName).join(params.connection);
        return 'You Might Have Joined A Channel';
      }

    }
    return 'You Joined Nothing. Sad Day. Call Us If You Feel Like You Should Have.';
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {

    const { channelName } = params.query;
    if(params.connection){
      this.app.channel(channelName).leave(connection => {
        return connection.user.id === params.connection.user.id;
      });
    }
    return 'You Left A Channel!';
  }
};
