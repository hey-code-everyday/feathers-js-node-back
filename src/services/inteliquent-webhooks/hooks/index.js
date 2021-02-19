const {BadRequest, Forbidden} = require('@feathersjs/errors');
const getIqParams = require('../../../inteliquent/inteliquent-params');

exports.getOrderUser = function () {
  return async context => {

    const {key} = context.params.query;

    //need to check the query params for a key here
    if(!key){
      throw new Forbidden('Invalid/Missing Key');
    }

    const iqParams = await getIqParams(context.app);
    if(key !== iqParams.IQNTWEBHOOKSKEY){
      throw new Forbidden('Invalid Key');
    }

    const orderRef = context.data.customerOrderReference;

    if(typeof orderRef !== 'undefined'){
      const refParts = orderRef.split('-');
      const tenantCode = refParts[0];
      const userId = refParts[1];

      const user = await context.app.service('users')._get(userId);

      if(!user){
        throw new BadRequest('No User Returned to Send the Email To!');
      }

      const tenant = await context.app.service('tenants')._find({
        paginate: false,
        query: {
          tenantCode
        }
      });

      context.params.userEmail = user.email;
      context.params.tenantName = tenant[0].name;
      context.params.tenantId = tenant[0].id;
    } else {
      throw new BadRequest('No User In Payload to Send Email To!');
    }

    return context;
  };
};
