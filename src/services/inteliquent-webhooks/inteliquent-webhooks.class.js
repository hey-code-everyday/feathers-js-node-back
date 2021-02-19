const {BadRequest} = require('@feathersjs/errors');
const sgMail = require('@sendgrid/mail');
const submittedTemplate = require('./templates/order-submitted');
const canceledTemplate = require('./templates/order-canceled');
const closedTemplate = require('./templates/order-closed');
const portComplete = require('./templates/port-complete');
const portFOC = require('./templates/port-foc');
const noteAdded = require('./templates/note-added');
const portRejected = require('./templates/port-rejected');
const addDids = require('./modules/add-dids');

class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup (app){
    this.app = app;
  }

  async find (params) {
    return ['Hey Boyeeee!'];
  }

  async get (id, params) {
    return {
      id, text: 'Hey Boyeeeeee!'
    };
  }

  async create (data, params) {

    let html = '';
    const {orderType, notificationType, orderStatus, groupStatus, orderId} = data;

    //we are going to throw out tnFeature type updates for Now
    if(orderType === 'TN Feature'){
      throw new BadRequest('We are not notifying on tn feature updates!');
    }

    //order status update for order as a whole
    if(notificationType === 'Order status update'){
      //order submitted
      if(orderStatus === 'Pending'){ html = await submittedTemplate(data, params, this.app);}
      //order completed
      if(orderStatus === 'Closed'){ html = await closedTemplate(data, params, this.app);}
      //order canceled
      if(orderStatus === 'Canceled'){ html = await canceledTemplate(data, params, this.app);}
    }

    //port group status update
    if(notificationType === 'Port-in group status update'){
      //port complete for group (the docs list activated instead of port complete)
      if(groupStatus === 'Port complete' || groupStatus === 'Activated'){
        html = await portComplete(data, params, this.app);
      //port group foc for group
      }else if (groupStatus.split(' ')[0] === 'FOC'){
        html = await portFOC(data, params, this.app);
        //insert numbers to DIDs table for Tenant
        await addDids(data, params, this.app);
      //port group rejection
      }else {
        html = await portRejected(data, params, this.app);
      }
    }

    //note added to order
    if(notificationType === 'Order note added'){ html = await noteAdded(data, params, this.app);}

    //this should not happen, but just in case throw error to stop execution. do not email nothing.
    if(html === ''){
      throw new BadRequest('No Information To Send To User');
    }

    //fetch the sendgrid api key from db
    const settings = await this.app.service('tenant-settings').find({paginate: false, query: {code: 'SENDGRIDAPIKEY'}});
    const sgApiKey = settings[0].value;
    sgMail.setApiKey(sgApiKey);
    const msg = {
      to: params.userEmail,
      from: 'noreply@voxo.co',
      subject: 'Update: Order #'+orderId,
      html: html
    };
    sgMail.send(msg);

    return data;
  }

  async update (id, data, params) {
    return 'HEY BOOYYEEEE';
  }

  async patch (id, data, params) {
    return 'HEY BOYEEEE';
  }

  async remove (id, params) {
    return 'hey boyeee!';
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
