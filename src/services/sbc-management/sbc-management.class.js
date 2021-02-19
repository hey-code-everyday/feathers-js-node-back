/* eslint-disable no-unused-vars */
const { BadRequest } = require('@feathersjs/errors');
const { kamResyncExt, kamExtension, kamTenantServer, kamReloadTable, bustHtable } = require('../../kamailio/rpc');

exports.SbcManagement = class SbcManagement {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {

    const { command } = data;

    //resync devices for peername
    if(command === 'resyncDevices'){
      this.resyncDevices(data);
      return 'Device Resync Success';
    }

    //get devices for peername
    if(command === 'kamExtension'){
      return await this.kamExtension(data);
    }

    //fire event for online / offline status notification
    if(command === 'extStatus'){
      //this is coming from kam so we need the noAuth Key
      this.notifyExtStatus(data);
      return 'User Notified';
    }

    if(command === 'tenantServer'){
      return await this.kamTenantServer(data);
    }

    if (command === 'reloadTable') {
      return await this.kamReloadTable(data);
    }

    if (command === 'bustHtable') {
      return await this.bustHtable(data);
    }

    return 'I Do Nothing For You!';
  }

  async resyncDevices(data) {

    await this.checkPeerName(data);

    const {peerName} = data;

    const kamParams = {peerName};

    return await kamResyncExt(kamParams);

  }

  async kamExtension(data) {

    await this.checkPeerName(data);
    const {peerName} = data;

    const kamParams = {peerName};

    return await kamExtension(kamParams);

  }

  async kamTenantServer(data){
    await this.checkTenantCode(data);
    const {tenantCode} = data;

    const kamParams = {tenantCode};

    return await kamTenantServer(kamParams);
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async notifyExtStatus(data){
    await this.checkPeerName(data);
    const { peerName, status } = data;
    const tenantCode = peerName.split('-')[1];
    const socketData = {
      roomType: 'extensions',
      peerName,
      status,
      tenantCode
    };
    this.app.service('channel-memberships').emit('notifyExtStatus', socketData);
  }

  async checkPeerName(data){

    const {peerName} = data;

    if(!peerName){
      throw new BadRequest('Peer Name Not Provided.');
    }
  }

  async checkTenantCode(data){

    const {tenantCode} = data;

    if(!tenantCode){
      throw new BadRequest('Tenant Code Not Provided.');
    }
  }

  async getKamCreds () {

    const settings = await this.app.service('tenant-settings')._find({
      paginate: false,
      query: {
        code: 'RPCAPIKEY'
      }
    });

    return settings[0].value;

  }

};
