const {BadRequest} = require('@feathersjs/errors');
const prepareEmailPost = require('./modules/prepare-email-post');
const prepareAppPost = require('./modules/prepare-app-post');
const { exec } = require('child_process');

/* eslint-disable no-unused-vars */
exports.OutboundFax = class OutboundFax {
  constructor (options) {
    this.options = options || {};
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

    console.log('outbound fax service requested!');
    data = {...data};
    //console.log(Object.create(data));
    //console.log(params);

    //check the query param to determine what type of functionality we need
    let faxParams = {};
    let reqType;
    if(params.hasOwnProperty('emailParse')){
      reqType = 'emailPost';
    } else if(params.hasOwnProperty('isFaxEvent')){
      console.log('this is a fax event');
      reqType = 'faxEvent';
    }else{
      if(!data.hasOwnProperty('reqType')){
        throw new BadRequest('Need the reqType param. Otherwise, get that garbage out of here! (Are Belongs)');
      }
      reqType = data.reqType;
    }


    switch (reqType){
    case 'emailPost':
      faxParams = await prepareEmailPost(params.emailParse, this.app);
      break;
    case 'appPost':
      faxParams = await prepareAppPost(data, params, this.app);
      break;
    default:
      return 'This Did Not Do Anything!';
    }

    //this might change.
    exec(`node /opt/omnia-api/src/child-processes/processFax.js ${JSON.stringify(faxParams)}`, function(error, stdout, stderr){
      console.log('we hit the fax child process callback! Is there an error??');
      console.log('Error', error);
      console.log('STDOUT:', stdout);
      console.log('STDERR:' ,stderr);
    });

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
