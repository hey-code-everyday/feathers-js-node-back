/* eslint-disable no-unused-vars */
const buildSummary = require('./modules/build-summary');
const buildHistory = require('./modules/build-history');
const buildRefused = require('./modules/build-refused');
const buildHours = require('./modules/build-hours');

const {natsClient} = require('../../nats/nats-adapter');
const NATS = require('nats');

exports.QueueStats = class QueueStats {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {

    //going to call different logic based on query Param
    const { command, queueId } = params.query;

    switch(command){
    case 'summary':
      return await this.queueSummary(queueId);
    case 'agentAverages':
      return await this.agentAverages(queueId);
    case 'agentHours':
      return await this.agentHours(params.query);
    case 'history':
      return await this.queueHistory(params.query);
    case 'refused':
      return await this.queueRefused(params.query);
    default:
      return 'What Are You Asking Me For? It Does Belongs.';
    }

  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    return 'I Do Nothing For You!';
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async queueSummary(ids){

    //these statistics will return summary stats for the current day up until time of query.
    const queueIds = JSON.parse(ids);

    //if it is an array we have to modify the query a bit.
    let queryNames;
    if(Array.isArray(queueIds)){
      queryNames = queueIds;
    } else {
      queryNames = [+ids];
    }

    //try NATS request first.
    const summaryRes =  await new Promise( (resolve, reject) => {
      natsClient.request('once.job',
        JSON.stringify({
          action: 'queueSummary',
          data: {queueIds: queryNames}
        }),
        {
          max: 1, timeout: 5000
        },
        (msg) => {
          if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
            resolve('failed');
          }
          resolve(msg);
        });
    });

    return summaryRes === 'failed' ? await buildSummary(queryNames, this.app) : JSON.parse(summaryRes);
  }

  async agentAverages(ids){

    //these stats will return averages per agent from the results of the nightly job that runs
    const queueIds = JSON.parse(ids);
    let queryNames;
    if(Array.isArray(queueIds)){
      queryNames = queueIds;
    } else{
      queryNames = [ids];
    }

    const sequelize = this.app.get('sequelizeClient');
    const avgRes = await sequelize.query(
      'SELECT ' +
        'name, ' +
        'queue_name as queueId, ' +
        'daily_in_avg as dailyInAvg, ' +
        'weekly_in_avg as weeklyInAvg, ' +
        'monthly_in_avg as monthlyInAvg, ' +
        'daily_out_avg as dailyOutAvg, ' +
        'weekly_out_avg as weeklyOutAvg, ' +
        'monthly_out_avg as monthlyOutAvg ' +
      'FROM ' +
        'agent_averages ' +
      'WHERE ' +
        'queue_name IN ('+queryNames+');',
      { type: sequelize.QueryTypes.SELECT}
    );

    return avgRes;
  }

  async queueHistory(params){

    //these statistics will return summary stats for the current day up until time of query.
    const queueIds = JSON.parse(params.queueId);
    const {start, end} = params;

    //if it is an array we have to modify the query a bit.
    let queryNames;
    if(Array.isArray(queueIds)){
      queryNames = queueIds;
    } else {
      queryNames = [+params.queueId];
    }

    //try NATS request first.
    const summaryRes =  await new Promise( (resolve, reject) => {
      natsClient.request('once.job',
        JSON.stringify({
          action: 'queueHistory',
          data: {queueIds: queryNames, start, end}
        }),
        {
          max: 1, timeout: 5000
        },
        (msg) => {
          if(msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT){
            resolve('failed');
          }
          resolve(msg);
        });
    });

    return summaryRes === 'failed' ? await buildHistory(queryNames, this.app, start, end) : JSON.parse(summaryRes);

  }

  async queueRefused(params){

    const queueIds = JSON.parse(params.queueId);
    let queryNames;
    if(Array.isArray(queueIds)){
      queryNames = queueIds;
    } else{
      queryNames = [params.queueId];
    }

    return await buildRefused(queryNames, this.app, params.start, params.end);

  }

  async agentHours(params){
    const queueIds = JSON.parse(params.queueId);
    let queryNames;
    if(Array.isArray(queueIds)){
      queryNames = queueIds;
    } else{
      queryNames = [params.queueId];
    }

    return await buildHours(queryNames, this.app, params.date);
  }

};
