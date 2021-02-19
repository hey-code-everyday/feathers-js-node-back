const {BadRequest} = require('@feathersjs/errors');
const axios = require('axios');

/* eslint-disable no-unused-vars */
exports.VoxoMeetCreds = class VoxoMeetCreds {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {

    //accept extension number
    if(!params.query.hasOwnProperty('ext')){
      throw new BadRequest('Missing Query Params. Must Include Extension Number!');
    }

    //accept tenantId
    if(!params.query.hasOwnProperty('tenantId')){
      throw new BadRequest('Missing Query Params. Must Include Tenant Account ID!');
    }

    const extension = await this.app.service('extensions').find({
      paginate: false,
      query: {
        number: params.query.ext,
        tenantId: params.query.tenantId
      }
    });

    if(!extension.length){
      throw new BadRequest('Extension Not Found');
    }

    const meetURL = `https://meet.voxo.co/${extension[0].peerSecret}`;
    const dialInId = await axios.get(
      `https://jitsi-api.jitsi.net/conferenceMapper?conference=${extension[0].peerSecret}@conference.meet.voxo.co`
    );

    return {
      meetURL,
      dialIn: `1.601.602.5068 PIN: ${dialInId.data.id}#`
    };
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
};
