const { iq_authenticate, iq_tnInventoryCoverage, iq_tnInventory, iq_numberProfile } = require('../../inteliquent/api');
const { BadRequest } = require('@feathersjs/errors');
const getIqParams = require('../../inteliquent/inteliquent-params');


class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {

    const { query } = params;
    let response;

    if(!Object.keys(query).length){
      throw new BadRequest('Invalid/Missing Query Parameters!');
    }

    // '/tn-ordering?context=coverage&state=&rateCenter='
    if(query.context == 'coverage'){
      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      const data = {state: query.state, rateCenter: query.rateCenter};
      response = await iq_tnInventoryCoverage(data, accessToken, iqParams);
      //add ids for feathers vuex compatibility
      for(let i = 0; i<response.length; i++){
        response[i]['id'] = i + 1;
      }
    }

    // '/tn-ordering?context=inventory.....'
    if(query.context == 'inventory'){
      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      const inventoryData = {
        tnMask: query.npanxx+'XXXX',
        rateCenter: query.rateCenter,
        state: query.state
      };
      response = await iq_tnInventory(inventoryData, accessToken, iqParams);
      //add ids for feathers vuex compatibility
      for(let i = 0; i < response.length; i++){
        response[i]['id'] = i + 1;
      }

    }

    // '/tn-ordering?context=numberDetails.... '
    if(query.context == 'numberDetails'){
      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      response = await iq_numberProfile(query.number, accessToken, iqParams);
      //add ids for feathers vuex compatibility
      response = [response];
    }

    return response;
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
