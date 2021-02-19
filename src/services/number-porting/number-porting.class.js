const { iq_authenticate, iq_portInAvailability, iq_csrLookup, iq_portInOrder } = require('../../inteliquent/api');
const getIqParams = require('../../inteliquent/inteliquent-params');
const groupBy = require('lodash/groupBy');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {

    const { query } = params;

    //make sure it is not just a call to validate
    if(!query.hasOwnProperty('context')){
      const numbers = JSON.parse(query.numbers);
      let response;

      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      response = await iq_portInAvailability(numbers, accessToken, iqParams);

      //provide shortened service providers name for csr lookup number array
      for(let i = 0; i<response.length; i++){
        if(response[i]['serviceProviderName'] == ''){
          response[i]['providerAbbr'] = 'None';
        } else{
          response[i]['providerAbbr'] = response[i]['serviceProviderName'].split(' ')[0];
        }
      }

      let serviceProviderGroups = groupBy(response, 'providerAbbr');

      //take one number from each service provider.
      //we will test each number until we have successful lookup
      //if not the user will have to fill everything out.
      let testNumbers = [];
      for (let group in serviceProviderGroups){
        testNumbers.push(serviceProviderGroups[group][0]['telephoneNumber']);
      }

      //experimenting with returning groups
      let csr;
      for (let group in serviceProviderGroups){
        csr = await iq_csrLookup(serviceProviderGroups[group][0]['telephoneNumber'], accessToken, iqParams);
        if(csr.statusCode.charAt(0) != '4' && csr.tnCsrLookupResponse.csrLookupResult == '0'){
          for(let i = 0; i<serviceProviderGroups[group].length; i++){
            serviceProviderGroups[group][i]['csrLookupResult'] = JSON.stringify(csr.tnCsrLookupResponse);
          }
        } else{
          for(let i = 0; i<serviceProviderGroups[group].length; i++) {
            serviceProviderGroups[group][i]['csrLookupResult'] = 'noResult';
          }
        }
      }

      //push each object into its own array
      let groupedData = [];
      for(let group in serviceProviderGroups){
        for(let i = 0; i<serviceProviderGroups[group].length; i++){
          groupedData.push(serviceProviderGroups[group][i]);
        }
      }

      let responseData = groupBy(groupedData, 'csrLookupResult');
      let groupResponse = [];
      let groupCount = 0;
      for(let group in responseData){
        groupCount++;
        let groupObject = {
          id: groupCount,
          csrGroup: group,
          numbers: responseData[group]
        };
        groupResponse.push(groupObject);
      }

      return groupResponse;
    }

    return [];


  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {

    const iqParams = await getIqParams(this.app);
    const accessToken = await iq_authenticate(iqParams);

    await iq_portInOrder(data, accessToken, iqParams);

    // console.log(data);
    //use number array and csr info to send a port order request

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
