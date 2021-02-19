const {natsClient} = require('../../nats/nats-adapter');
const generator = require('generate-password');
const moment = require('moment');

/* eslint-disable no-unused-vars */
exports.NatsActionsHandler = class NatsActionsHandler {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
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

    const {reqType} = data;

    //based on the request from the user we need to send a NATS message to do jazz
    switch(reqType) {
    case 'transfer':
      this.publishTransfer(data);
      break;
    case 'transferAT':
      this.publishTransferAT(data);
      break;
    case 'cancelAtxfer':
      this.publishCancelAtxfer(data);
      break;
    case 'swapAtxfer':
      this.publishSwapAtxfer(data);
      break;
    case 'mergeAtxfer':
      this.publishMergeAtxfer(data);
      break;
    case 'spy':
      this.publishSpyCall(data);
      break;
    case 'dial':
      this.publishDialCall(data);
      break;
    case 'hangup':
      this.publishHangupCall(data);
      break;
    case 'setDND':
      this.publishSetDND(data);
      break;
    case 'DTMF':
      this.publishSendDTMF(data);
      break;
    case 'refreshConnectedCalls':
      this.publishRefreshConnectedCalls(data);
      break;
    case 'queueStatus':
      this.publishRequestQueueStatus(data);
      break;
    case 'refreshQueueConnected':
      this.publishRefreshQueueConnected(data);
      break;
    case 'queuePause':
      this.publishAgentPause(data);
      break;
    case 'queueUnpause':
      this.publishAgentUnpause(data);
      break;
    case 'queueLogout':
      this.publishAgentLogout(data);
      break;
    case 'queueLogin':
      this.publishAgentLogin(data);
      break;
    default:
      break;
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }

  async publishTransfer (data) {
    const {channel, ext, server} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'transferCall',
      data: {
        channel,
        exten: ext
      }
    }));
  }

  async publishTransferAT (data) {
    const {channel, ext, server} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'atxfer',
        channel,
        exten: ext + '#',
        priority: 1,
        context: 'authenticated'
      }
    }));
  }

  async publishCancelAtxfer (data) {
    const {channel, server} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'cancelatxfer',
        channel
      }
    }));
  }

  async publishSwapAtxfer (data) {
    const {channel, server} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'swapAtxfer',
      data: {
        channel
      }
    }));
  }

  async publishMergeAtxfer (data) {
    const {channel, server} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'mergeAtxfer',
      data: {
        channel
      }
    }));
  }

  async publishSpyCall (data) {
    const {channelPrefix, whisper, channelName, callerId, tenantCode, hostServer} = data;
    const appData = whisper ? `${channelPrefix},w` : `${channelPrefix},bq`;
    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'originate',
        channel: channelName,
        callerid: callerId,
        application: 'ChanSpy',
        data: appData,
        account: tenantCode,
        async: 'true'
      }
    }));
  }

  async publishHangupCall (data) {
    const {server, channel} = data;
    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'hangup',
        channel,
        cause: '16'
      }
    }));
  }

  async publishDialCall (data) {
    const {hostServer, extension, dest, name, callerId, tenantCode} = data;
    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'originate',
        channel: `Local/${extension}@authenticated`,
        exten: dest,
        context: 'authenticated',
        priority: '1',
        callerid: `${name} <${callerId}>`,
        account: tenantCode,
        async: 'true'
      }
    }));
  }

  async publishSetDND (data) {
    const {peerName, dndStatus, extensionId, hostServer} = data;
    const dndString = `DND:${peerName}:${dndStatus}`;
    this.app.service('extensions').patch(extensionId, {dnd: dndStatus});

    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'userevent',
        userevent: dndString
      }
    }));
    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'userevent',
        userevent: 'REFRESHEXT',
        exid: extensionId
      }
    }));
  }

  async publishSendDTMF (data) {
    const {hostServer, channel, value} = data;
    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'sendDTMF',
      data: {
        channel,
        value
      }
    }));
  }

  async publishRefreshConnectedCalls (data) {
    const {tenantCode, userId, userExten, panelTenantCode} = data;
    let hostServer = panelTenantCode ? await this.getAsteriskServer(data) : data.hostServer;
    natsClient.publish(`actions.presence.${hostServer}`, JSON.stringify({
      action: 'getTenantCalls',
      teCode: tenantCode,
      userId,
      userExten
    }));
  }

  async publishRequestQueueStatus (data) {
    let { server } = data;
    const {queueId, queryServer} = data;

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    } else if(queryServer){
      server = await this.getTenantServerFromStates(data.tenantCode);
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'queuestatus',
        queue: queueId
      }
    }));
  }

  async publishRefreshQueueConnected (data){
    let {server} = data;
    const { queueId, queryServer, tenantCode, userId, userExten} = data;

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    } else if(queryServer){
      server = await this.getTenantServerFromStates(data.tenantCode);
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'getTenantCalls',
      teCode: tenantCode,
      userId,
      userExten
    }));
  }

  async publishAgentPause(data){
    const sequelize = this.app.get('sequelizeClient');

    let {server} = data;
    const { queueId, extensionId, memberName, pauseReason, peerName} = data;
    const randomId = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
    });

    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

    await sequelize.query(
      `INSERT into queue_log(time,callid,queuename,agent,event,data1) select '${dateNow}','${randomId}-${queueId}','${queueId}','${memberName}','PAUSE','${pauseReason}' from queue_member where queue_name='${queueId}' and interface like 'Local/AG%-%-%-${extensionId}@fromotherpbx%' and ( paused=0 or paused is null)`
    );

    await sequelize.query(
      `UPDATE queue_member set paused=1 where queue_name='${queueId}' and interface like 'Local/AG%-%-%-${extensionId}@fromotherpbx%'`
    );

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'queueAgentPause',
      data: {
        interface: data.interface,
        queue: queueId,
        reason: pauseReason,
        peerName,
        memberName
      }
    }));

  }

  async publishAgentUnpause (data) {
    const sequelize = this.app.get('sequelizeClient');
    let {server} = data;
    const { queueId, extensionId, memberName, peerName } = data;

    const randomId = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
    });

    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

    await sequelize.query(
      `INSERT into queue_log(time,callid,queuename,agent,event,data1) select '${dateNow}','${randomId}-${queueId}','${queueId}','${memberName}','UNPAUSE','' from queue_member where queue_name='${queueId}' and interface like 'Local/AG%-%-%-${extensionId}@fromotherpbx%' and paused=1`
    );

    await sequelize.query(
      `UPDATE queue_member set paused=0 where queue_name='${queueId}' and interface like 'Local/AG%-%-%-${extensionId}@fromotherpbx%'`
    );

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'queueAgentUnpause',
      data: {
        interface: data.interface,
        queue: queueId,
        peerName,
        memberName
      }
    }));
  }

  async publishAgentLogin(data){
    const sequelize = this.app.get('sequelizeClient');

    //prepare vars
    let {server} = data;
    const {queueId, memberName, extensionId, peerName} = data;
    const callId = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
    });

    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

    await sequelize.query(
      `INSERT into queue_log(time,callid,queuename,agent,event) select '${dateNow}','${callId}-LOGIN-${queueId}','${queueId}','${memberName}','LOGIN' from qu_queues where qu_id='${queueId}' and qu_id not in (select queue_name from queue_member where queue_name='${queueId}' and interface like 'Local/AG%-%-%-${extensionId}@fromotherpbx%')`
    );

    await sequelize.query(
      `INSERT IGNORE INTO queue_member(membername,queue_name,interface,state_interface,member_device,penalty) values ('${memberName}','${queueId}','Local/AG-000-NF-${extensionId}@fromotherpbx','Custom:${peerName}','${peerName}','0')`
    );

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'userevent',
        userevent: 'REFRESHQUEUE',
        QueueID: queueId,
        Channel: queueId,
        Peer: peerName,
        Loggedin: 1
      }
    }));
  }

  async publishAgentLogout(data){
    const sequelize = this.app.get('sequelizeClient');

    //prepare vars
    let {server} = data;
    const { queueId, memberName, peerName } = data;
    const callId = generator.generate({
      length: 12,
      numbers: true,
      uppercase: true,
    });

    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');

    //insert queue log
    await sequelize.query(
      `INSERT into queue_log(time,callid,queuename,agent,event) select '${dateNow}','${callId}-LOGOUT-${queueId}','${queueId}','${memberName}','LOGOUT' from queue_member where queue_name='${queueId}' and member_device='${peerName}'`
    );

    await sequelize.query(
      `DELETE FROM queue_member where queue_name='${queueId}' and member_device='${peerName}'`
    );

    //check qu_hosted and give priority if populated
    const quHosted = await this.queryQueueHosted(queueId);
    if(quHosted.length > 1){
      server = quHosted;
    }

    natsClient.publish(`actions.presence.${server}`, JSON.stringify({
      action: 'amiAction',
      data: {
        action: 'userevent',
        userevent: 'REFRESHQUEUE',
        QueueID: queueId,
        Channel: queueId,
        Peer: peerName,
        Loggedin: 0
      }
    }));
  }

  //Pre-Publish Responsibilities For Specific Events
  async getAsteriskServer(data){
    //this code is deprecated due to moving kamailio rpc to event driven
    const res = await this.app.service('sbc-management').create({
      command: 'tenantServer',
      tenantCode: data.panelTenantCode
    });

    if(res !== 'failed'){
      return res.hostName;
    }

    return await this.getTenantServerFromStates(data.panelTenantCode);
  }

  async getTenantServerFromStates(teCode){
    const sequelize = this.app.get('sequelizeClient');
    const statesQuery = await sequelize.query(`SELECT * FROM st_states WHERE st_extension LIKE '%-${teCode}' AND st_peername <> '' ORDER BY st_timestamp DESC LIMIT 1`, { type: sequelize.QueryTypes.SELECT});
    return statesQuery.length ? statesQuery[0].st_peername : '';
  }

  async queryQueueHosted(id){
    if(id){
      const queue = await this.app.service('queues')._get(id);
      return queue.hostServer;
    }
    return '';
  }

};
