const { BadRequest } = require('@feathersjs/errors');
const axios = require('axios');
const querystring = require('querystring');

//this is simply to authenticate and get an access token
exports.iq_authenticate = async (params) => {

  const queryParams = {
    client_id: params.IQNTCLIENTID,
    client_secret: params.IQNTCLIENTSECRET,
    grant_type: 'client_credentials'
  };

  return await axios.post(params.IQNTAUTHURL, querystring.stringify(queryParams),)
    .then( res => {return res.data.access_token;});
};

//this will return the corrected/verified address object or throw an error
exports.iq_validateAddress = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    streetNum: data.streetNum,
    streetInfo: data.streetInfo,
    location: data.location,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode
  };

  return await axios.post(
    params.IQNTBASEURL + 'addressValidate',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {

    // console.log(res);
    const { status, statusCode } = res.data;
    const addressData = res.data.addressValidateResponse;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    if(addressData.validationResult == '2'){
      throw new BadRequest('You Must Provide a Valid Address!');
    }

    return {
      streetNum:  addressData.correctedStreetNum,
      streetInfo:  addressData.correctedStreetInfo,
      location:  addressData.correctedLocation,
      city: addressData.correctedCity,
      state:  addressData.correctedState,
      postalCode:  addressData.correctedPostalCode,
    };
  });

};

//this is just to lookup number inventory. this will be more advanced beyond e911. we will stick with this for now.
exports.iq_tnInventory911 = async (token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    quantity: 1,
    tnWildcard: '601???????'
  };

  return await axios.post(
    params.IQNTBASEURL + 'tnInventory',
    reqBody,
    {headers: {'Authorization': 'Bearer '+token}}
  ).then( res => {

    // console.log(res);
    const { status, statusCode } = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res.data.tnResult[0].telephoneNumber;
  });

};

//order the number with 911 feature enabled.
exports.iq_order911 = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnOrder: {
      tnList: {
        tnItem: [
          {
            tn: data.number,
            tnFeature: {
              e911: {
                name: data.name,
                origStreetNum: data.streetNum,
                origStreetInfo: data.streetInfo,
                origLocation: data.location,
                origCity: data.city,
                origState: data.state,
                origPostalCode: data.postalCode
              }
            }
          }
        ]
      }
    }
  };

  await axios.post(
    params.IQNTBASEURL+'tnOrder',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {

    // console.log(res);

    const {status, statusCode} = res.data;

    if(status.charAt(0) == '{'){
      throw new BadRequest(status);
    }

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res;
  });

};

exports.iq_removeE911 = async (number, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tn: number,
    removeE911: 'Y'
  };

  await axios.post(
    params.IQNTBASEURL+'tnE911',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {
    const {status, statusCode} = res.data;

    if(status.charAt(0) == '{'){
      throw new BadRequest(status);
    }

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res;
  });

};

exports.iq_tnDisconnect = async (number, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnList: {
      tnItem: [
        {tn: number}
      ]
    }
  };

  await axios.post(
    params.IQNTBASEURL+'tnDisconnect',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    const { status, statusCode } = res.data;
    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }
  } );

};

exports.iq_update911 = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnFeatureOrder: {
      tnList: {
        tnItem: [
          {
            tn: data.number,
            tnFeature: {
              e911: {
                name: data.name,
                origStreetNum: data.streetNum,
                origStreetInfo: data.streetInfo,
                origLocation: data.location,
                origCity: data.city,
                origState: data.state,
                origPostalCode: data.postalCode
              }
            }
          }
        ]
      }
    }
  };

  await axios.post(
    params.IQNTBASEURL+'tnFeatureOrder',
    reqBody,
    {
      headers: {'Authorization' : 'Bearer '+token}
    }
  ).then(res=> {
    const {status, statusCode} = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res;
  });

};

exports.iq_tnInventoryCoverage = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    rateCenter: data.rateCenter
  };

  return await axios.post(
    params.IQNTBASEURL+'tnInventoryCoverage',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {

    const {status, statusCode} = res.data;
/*    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }*/

    let responseObject = [];
    if(res.data.hasOwnProperty('tnInventoryCoverageList')){
      let coverageList = res.data.tnInventoryCoverageList;

      for(let i = 0; i<coverageList.length; i++){
        if(coverageList[i].locState == data.state && coverageList[i].count){
          responseObject.push(coverageList[i]);
        }
      }
    }

    return responseObject;
  });

};

exports.iq_tnInventory = async(data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnMask: data.tnMask,
    rateCenter: data.rateCenter,
    province: data.state,
    quantity: 75
  };

  return await axios.post(
    params.IQNTBASEURL+'tnInventory',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {

    const {status, statusCode} = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res.data.tnResult;
  });

};

exports.iq_tnOrder = async(data, token, params) => {

  let tnItems = [];

  for(let i = 0; i<data.numbers.length; i++){
    tnItems.push(
      {
        tn: data.numbers[i],
        trunkGroup: params.IQNTTRUNKGROUP,
        tnFeature: {
          callerId: {
            callingName: data.tenantName
          },
          messaging: {
            messageClass: 'A2PLC',
            messageType: 'SMS'
          }
        }
      }
    );
  }

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnOrder: {
      customerOrderReference: data.pon,
      tnList: {
        tnItem: tnItems
      }
    }
  };

  return await axios.post(
    params.IQNTBASEURL+'tnOrder',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {
    // console.log(res);
    const {status, statusCode} = res.data;

    if(statusCode == '4'){
      throw new BadRequest(status);
    }

    let badNumbers = [];
    if(status.charAt(0) == '{'){
      badNumbers = status.match(/[0-9]{10}/g);
      // throw new BadRequest('Cannot Complete Order: ' + status);
    }

    return {
      numbers: badNumbers,
      message: status
    };
  });

};

exports.iq_numberProfile = async(number, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnSearchList: {
      tnSearchItem: [
        {
          tnMask: number
        }
      ]
    }
  };

  return await axios.post(
    params.IQNTBASEURL+'tnDetail',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {

    const { status, statusCode } = res.data;

    if(statusCode == '4'){
      throw new BadRequest(status);
    }

    return res.data.tnList.tnItem[0];
  });

};

exports.iq_updateNumber = async(data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tnFeatureOrder: {
      tnList: {
        tnItem: [
          {
            tn: data.number,
            tnFeature: {
              callerId: {
                callingName: data.name.substr(0,14)
              }
            }
          }
        ]
      }
    }
  };

  await axios.post(
    params.IQNTBASEURL+'tnFeatureOrder',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {
    const { status, statusCode } = res.data;
    if(statusCode == '4'){
      throw new BadRequest(status);
    }
  });

};

exports.iq_portInAvailability = async (numbers, token, params) => {

  let tnItems = [];

  for(let i = 0; i<numbers.length; i++){
    tnItems.push({ tn: numbers[i] });
  }

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    returnServiceProviderName: true,
    tnList: {
      tnItem: tnItems
    }
  };

  return await axios.post(
    params.IQNTBASEURL+'portInAvailability',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res);
    const {status, statusCode} = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest('List Includes No Portable Numbers!');
    }

    return res.data.serviceAvailable;
  });

};

exports.iq_csrLookup = async (number, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    tn: number
  };

  return await axios.post(
    params.IQNTBASEURL+'tnCsrLookup',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    const {status, statusCode} = res.data;
    //may need some additional error catching here.
    return res.data;
  });

};

exports.iq_portInOrder = async(data, token, params) => {

  const dataLength = data.length;
  let tnItems = [];

  let dateNow = new Date();
  let monthNow = dateNow.getMonth() + 1;
  let dayNow = dateNow.getDate();
  if(monthNow < 10){ monthNow = '0'+monthNow;}
  if(dayNow < 10){ dayNow = '0'+dayNow;}


  for(let i = 0; i<dataLength-1; i++){
    for(let k = 0; k<data[i].numberArray.length; k++){
      tnItems.push(
        {
          tn: data[i].numberArray[k],
          trunkGroup: params.IQNTTRUNKGROUP,
          accountNum: data[i].accountNumber == '' ? data[i].numberArray[0] : data[i].accountNumber.substr(0,19),
          atn: data[i].numberArray[0],
          authName: data[i].authorizedPerson,
          accountPin: data[i].accountPin,
          authDate: dateNow.getFullYear() + '-' + monthNow + '-' + dayNow,
          endUser: {
            name: data[i].companyName.substr(0,19),
            streetNum: data[i].streetNum,
            streetName: data[i].streetInfo,
            city: data[i].city,
            state: data[i].state,
            postalCode: data[i].postalCode,
            typeOfService: 'B'
          },
          tnFeature: {
            callerId: {
              callingName: data[dataLength-1].callerName.substr(0, 14)
            },
            messaging: {
              messageClass: 'A2PLC',
              messageType: 'SMS'
            }
          }
        }
      );
    }
  }

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    portInOrder: {
      customerOrderReference: data[dataLength-1].orderRef,
      desiredDueDate: data[dataLength-1].portDate.split('T')[0],
      onDemandActivation: 'Y',
      tnList: {
        tnItem: tnItems
      }
    }
  };

  return await axios.post(
    params.IQNTBASEURL+'portInOrder',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res);
    const { status, statusCode } = res.data;
    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }
    return res;
  });

};

exports.iq_portInOrderList = async (orderRef, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    customerOrderReference: orderRef
  };

  return await axios.post(
    params.IQNTBASEURL+'portInOrderList',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res);

    const {status, statusCode} = res.data;

/*    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }*/

    if(res.data.hasOwnProperty('orderList')){
      return res.data.orderList.orderType;
    }

    return [];

  });

};

exports.iq_availablePortActivations = async (orderId, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderId: orderId
  };

  return await axios.post(
    params.IQNTBASEURL+'portInOrderAvailableActivation',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( (res) => {
    // console.log(res);

    const { status, statusCode } = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }

    return res.data.availableActivationList;
  });

};

exports.iq_portInOrderActivate = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderId: data.orderId,
    tnGroup: data.tnGroups
  };

  return await axios.post(
    params.IQNTBASEURL+'portInOrderActivate',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res);

    const { status, statusCode } = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }
  });

};

exports.iq_getOrderDetail = async (orderNumber, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderId: orderNumber
  };

  return await axios.post(
    params.IQNTBASEURL+'orderDetail',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res.data);

    if(res.data.hasOwnProperty('orderDetailResponse')){
      return res.data.orderDetailResponse;
    } else{
      throw new BadRequest('Order Number Does Not Exist!');
    }
  });

};

exports.iq_editPortOrder = async (data, token, params) => {

  let reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderUpdate: {
      orderId: data.orderId,
    }
  };

  if(data.hasOwnProperty('desiredDueDate')){
    if(data.desiredDueDate !== null){
      reqBody.orderUpdate['desiredDueDate'] = data.desiredDueDate.split('T')[0];
    }
  }

  let tnItems = [];
  for(let i = 0; i<data.tnGroups.length; i++){
    const currentTn = data.tnGroups[i];
    const tnObject = {
      tn: parseInt(currentTn.tn),
      trunkGroup: currentTn.trunkGroup,
      accountNum: currentTn.accountNum.substr(0,19),
      authName: currentTn.authName,
      atn: currentTn.atn,
      authDate: currentTn.authDate,
      accountPin: currentTn.accountPIN,
      endUser: {
        name: currentTn.name.substr(0,19),
        streetNum: currentTn.streetNum,
        streetName: currentTn.streetName,
        locationType1: currentTn.locationType1,
        locationValue1: currentTn.locationValue1,
        city: currentTn.city,
        state: currentTn.state,
        postalCode: currentTn.postalCode,
        typeOfService: 'B'
      }
    };
    tnItems.push(tnObject);
  }

  if(tnItems.length){
    reqBody['orderUpdate']['tnList'] = {
      tnItem: tnItems
    };
  }

  // console.log(reqBody.orderUpdate.tnList);

  await axios.post(
    params.IQNTBASEURL+'orderUpdate',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res);

    const {status, statusCode} = res.data;

    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }
  });

};

exports.iq_addOrderNote = async (data, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderId: data.orderId,
    orderNote: data.orderNote
  };

  await axios.post(
    params.IQNTBASEURL+'orderAddNote',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then( res => {
    // console.log(res)
    const { status, statusCode } = res.data;
    if(statusCode.charAt(0) == '4'){
      throw new BadRequest(status);
    }
  });

};

exports.iq_viewOrderNotes = async (orderId, token, params) => {

  const reqBody = {
    privateKey: params.IQNTCLIENTID,
    orderId: orderId
  };

  return await axios.post(
    params.IQNTBASEURL+'orderNote',
    reqBody,
    {
      headers: {'Authorization': 'Bearer '+token}
    }
  ).then(res => {
    // console.log(res);
    if(res.data.hasOwnProperty('orderNote')){
      return res.data.orderNote.orderNoteType;
    }
  });

};
