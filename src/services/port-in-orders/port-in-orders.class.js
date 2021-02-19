const { BadRequest } = require('@feathersjs/errors');
const { iq_authenticate,
  iq_portInOrderList,
  iq_availablePortActivations,
  iq_portInOrderActivate,
  iq_editPortOrder,
  iq_addOrderNote,
  iq_viewOrderNotes,
  iq_getOrderDetail } = require('../../inteliquent/api');
const getIqParams = require('../../inteliquent/inteliquent-params');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {

    const {orderRef} = params.query;

    //this will return all orders
    const iqParams = await getIqParams(this.app);
    const accessToken = await iq_authenticate(iqParams);
    return await iq_portInOrderList(orderRef, accessToken, iqParams);

  }

  async get (id, params) {
    const iqParams = await getIqParams(this.app);
    const accessToken = await iq_authenticate(iqParams);
    const orderDetail = await iq_getOrderDetail(id, accessToken, iqParams);
    const orderNotes = await iq_viewOrderNotes(id, accessToken, iqParams);

    //for app I am going to return things grouped by pending/complete/confirmed/rejected
    let tnItems = [];
    for(let i = 0; i<orderDetail.tnList.tnItem.length; i++){
      const orderItem = orderDetail.tnList.tnItem[i];
      let groupObject = {
        telephoneNumber: orderItem.tn.toString(),
        tnStatus: orderItem.tnStatus,
        streetNum: orderItem.endUser.streetNum,
        streetPreDir: orderItem.endUser.streetPreDir,
        streetName: orderItem.endUser.streetName,
        streetType: orderItem.endUser.streetType,
        locationType: orderItem.endUser.locationType1,
        locationNumber: orderItem.endUser.locationValue1,
        city: orderItem.endUser.city,
        state: orderItem.endUser.state,
        postalCode: orderItem.endUser.postalCode,
        tnGroup: orderItem.tnGroup,
        name: orderItem.endUser.name,
        trunkGroup: orderItem.trunkGroup,
        accountNum: orderItem.accountNum,
        atn: orderItem.atn,
        accountPin: orderItem.accountPin,
        authName: orderItem.authName,
        authDate: orderItem.authDate
      };
      tnItems.push(groupObject);
    }

    // const tnGroups = groupBy(tnItems, 'tnStatus');

    orderDetail['tnGroups'] = tnItems;

    const responseData = {
      orderId: orderDetail.orderId,
      customerOrderReference: orderDetail.customerOrderReference,
      orderStatus: orderDetail.orderStatus,
      desiredDueDate: orderDetail.desiredDueDate,
      orderNotes: orderNotes,
      tnGroups: tnItems
    };

    return responseData;
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {

    //we will use this method for activations for a port order.
    //check if we are querying the number groups available or actually sending activation request
    const { action } = data;

    //this just return the groups and numbers to the users to confirm
    if(action === 'query'){
      //auth and get available activation groups
      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      const availableActivations = await iq_availablePortActivations(id, accessToken, iqParams);

      if(!availableActivations.length){
        throw new BadRequest('There Are No Numbers Available For Activation On This Order!');
      }

      let activationGroups = [];
      //create array of tnGroups with available activations
      for (let i = 0; i<availableActivations.length; i++){
        let numberArray = [];
        if(availableActivations[i].hasOwnProperty('tnList')){
          for(let k = 0; k<availableActivations[i].tnList.tnItem.length; k++){
            numberArray.push(availableActivations[i].tnList.tnItem[k].tn);
          }
        }
        // console.log(numberArray);
        let groupObject = {
          group: availableActivations[i].tnGroup,
          numbers: numberArray
        };
        activationGroups.push(groupObject);
      }

      return {orderId: id, data: activationGroups};
    }

    //send request to activate groups on this order after user confirms on front end.
    if(action === 'activate'){

      const iqParams = await getIqParams(this.app);
      const accessToken = await iq_authenticate(iqParams);
      const availableActivations = await iq_availablePortActivations(id, accessToken, iqParams);

      if(!availableActivations.length){
        throw new BadRequest('There Are No Numbers Available For Activation On This Order!');
      }

      let activationGroups = [];
      for(let i = 0; i<availableActivations.length; i++){
        activationGroups.push(availableActivations[i].tnGroup);
      }

      const activateData = {
        orderId: id,
        tnGroups: activationGroups
      };
      await iq_portInOrderActivate(activateData, accessToken, iqParams);
      return activateData;

    }

    throw new BadRequest('Invalid Post Data!');
  }

  async patch (id, data, params) {

    //we will use this method for editing port order

    // console.log(data);
    let willEditOrder = false;

    let editOrderData = {
      orderId: id,
    };
    //push in the changed port date if its there
    if(data.hasOwnProperty('desiredDueDate')){
      editOrderData['desiredDueDate'] = data.desiredDueDate;
      willEditOrder = true;
    }

    editOrderData['tnGroups'] = [];
    //loop through object and create tn order groups
    for(let i = 0; i < Object.keys(data).length; i++){
      let key = Object.keys(data)[i];
      if(key !== 'desiredDueDate' && key !== 'orderId' && key !== 'orderNote'){
        let orderObject = {
          tn: key,
          name: data[key].name,
          streetNum: data[key].streetNum,
          streetName: data[key].streetName,
          locationType1: data[key].locationType1,
          locationValue1: data[key].locationValue1,
          city: data[key].city,
          state: data[key].state,
          postalCode: data[key].postalCode,
          accountNum: data[key].accountNum,
          authName: data[key].authName,
          authDate: data[key].authDate,
          trunkGroup: data[key].trunkGroup,
          atn: data[key].atn
        };
        editOrderData['tnGroups'].push(orderObject);
      }
    }

    if(editOrderData['tnGroups'].length){
      willEditOrder = true;
    }

    const iqParams = await getIqParams(this.app);
    const accessToken = await iq_authenticate(iqParams);
    //edit the port Order
    if(willEditOrder){
      await iq_editPortOrder(editOrderData, accessToken, iqParams);
    }
    //add an orderNote if Present
    if(data.hasOwnProperty('orderNote')){
      iq_addOrderNote({
        orderId: id,
        orderNote: data.orderNote
      }, accessToken, iqParams);
    }

    return {orderId: id};
  }

  async remove (id, params) {
    return { id };
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
