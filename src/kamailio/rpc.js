const { BadRequest } = require('@feathersjs/errors');
const NATS = require('nats');
const {natsClient} = require('../nats/nats-adapter');
const axios = require('axios');

//global settings
const reqTimeout = 10000;

//fetch the stats of a kamailio instance.
exports.kamStats = async (params) => {

  const {rpcKey, location} = params;
  const reqUrl = `http://${location}.voxo.co:42184/rpc/info/stats`;

  try {
    const res = await axios.post(
      reqUrl,
      {},
      {
        timeout: reqTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': rpcKey
        }
      }
    );
    return res.data;
  } catch (e){
    //check for aborted connection (due to timeout)
    //this is so we can notify the caller and another server could be attempted
    if(e.code === 'ECONNABORTED'){
      return 'timeout';
    } else{
      throw new BadRequest(e);
    }
  }

};


//fetch the process of a kamailio instance
exports.kamProcesses = async (params) => {

  const {rpcKey, location} = params;
  const reqUrl = `http://${location}.voxo.co:42184/rpc/info/psa`;

  try {
    const res = await axios.post(
      reqUrl,
      {},
      {
        timeout: reqTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': rpcKey
        }
      }
    );
    return res.data;
  } catch (e){
    //check for aborted connection (due to timeout)
    //this is so we can notify the caller and another server could be attempted
    if(e.code === 'ECONNABORTED'){
      return 'timeout';
    } else{
      throw new BadRequest(e);
    }
  }

};

//fetch the uptime of a kamilio instance
exports.kamUptime = async (params) => {

  const {rpcKey, location} = params;
  const reqUrl = `http://${location}.voxo.co:42184/rpc/info/uptime`;

  try {
    const res = await axios.post(
      reqUrl,
      {},
      {
        timeout: reqTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': rpcKey
        }
      }
    );
    return res.data;
  } catch (e){
    //check for aborted connection (due to timeout)
    //this is so we can notify the caller and another server could be attempted
    if(e.code === 'ECONNABORTED'){
      return 'timeout';
    } else{
      throw new BadRequest(e);
    }
  }

};

//get information about a specific extension from a kamailio instance
exports.kamExtension = async (params) => {

  const {peerName} = params;

  return await new Promise((resolve, reject) => {
    natsClient.request('actions.rpc',
      JSON.stringify({
        action: 'getExtension',
        data: {
          type: 'extension',
          peer: peerName
        }
      }),
      {
        max: 1, timeout: 2000
      },
      (msg) => {
        if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
          resolve('Request Failed: Timeout.');
        } else{
          resolve(JSON.parse(msg));
        }
      });
  });

};

//find out what asterisk server a tenant is on
exports.kamTenantServer = async (params) => {

  const {tenantCode} = params;

  return await new Promise( (resolve, reject) => {
    natsClient.request('actions.rpc',
      JSON.stringify({
        action: 'getTenantServer',
        data: {tenantCode}
      }),
      {
        max: 1, timeout: 2000
      },
      (msg) => {
        if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
          resolve('failed');
        }
        resolve(JSON.parse(msg));
      });
  });

};

//reload table for a kamailio instance (trusted, domain, dispatcher)
exports.kamReloadTable = async (params) => {
  return await new Promise( (resolve, reject) => {
    natsClient.request('actions.rpc',
      JSON.stringify({
        action: 'reloadTable',
        data: {
          type: params.table
        }
      }),
      {
        max: 1, timeout: 2000
      },
      (msg) => {
        if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
          resolve('failed');
        }
        resolve(JSON.parse(msg));
      });
  });

};

//clear the user preferences cache for a tenant on a kamailio instance
exports.bustHtable = async (params) => {

  const {peer} = params;

  return await new Promise( (resolve, reject) => {
    natsClient.request('once.rpc',
      JSON.stringify({
        action: 'bustHtable',
        data: {peer}
      }),
      {
        max: 1, timeout: 2000
      },
      (msg) => {
        if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
          resolve('failed');
        }
        resolve(JSON.parse(msg));
      });
  });

};

//send resync to all devices for an extension
exports.kamResyncExt = async (params) => {

  const {command, peerName} = params;

  return await new Promise( (resolve, reject) => {
    natsClient.request('once.rpc',
      JSON.stringify({
        action: 'notify',
        data: {command, peer: peerName, command: 'check-sync'}
      }),
      {
        max: 1, timeout: 2000
      },
      (msg) => {
        if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
          resolve('failed');
        }
        resolve({'result': 'Sent resync to devices'});
      });
  });

};
