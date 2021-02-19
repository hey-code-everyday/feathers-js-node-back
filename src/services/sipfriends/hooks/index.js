const generator = require('generate-password');
const { BadRequest } = require('@feathersjs/errors');
const defaults = require('../validation/defaults');

exports.beforeCreateSipfriend = function () {
  return async (context) => {
    const { data } = context;

    const secret = generator.generate({
      length: 16,
      numbers: true,
      strict: true,
    });

    const sipfriend = await context.app
      .service('sipfriends')
      .find({ query: { name: data.extNumber + '-' + data.tenantCode } });

    if (sipfriend.length) {
      throw new BadRequest('The sipfriend with same name already exists.');
    }

    const subscribemwi = data.email === '' && data.extType === 'desk' ? 'yes' : 'no';

    //creation object from post data
    let createBody = {
      tenantId: data.tenantId,
      name: data.extNumber + '-' + data.tenantCode,
      secret,
      accountCode: data.tenantCode,
      callerId: data.extName + '<' + data.extNumber + '>',
      parkingLot: data.tenantCode,
      subscribemwi,
      mailbox: data.extType === 'desk' ? data.extNumber + '@' + data.tenantCode : '',
      defaultUser: data.extNumber + '-' + data.tenantCode,
      callLimit: data.callPathField ? data.callPathField : 10
    };

    // console.log(createBody);
    context.data = {
      ...defaults,
      ...createBody,
    };

    return context;
  };
};
