const {Forbidden} = require('@feathersjs/errors');

exports.addRecording = function () {
  return async context => {
    context.params.sequelize = {
      attributes: ['id', 'recording', 'mailboxuser', 'mailboxContext']
    };
  };
};

exports.checkVMGetAuth = function () {
  return async context => {

    const { tenantId, mailboxuser, mailboxContext } = context.result;

    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole, myExtension, email, tenantIds } = context.params.user;

    if(+userRole === 5 || +userRole === 7){

      if(!myExtension){
        const extension = await context.app.service('extensions')._find({
          paginate: false,
          query: {
            email
          }
        });
        if(!extension.length){
          throw new Forbidden('You cannot fetch this record!');
        }

        const extTenantCode = await context.app.service('tenants')._get(extension[0].tenantId).tenantCode;

        context.params.user.myExtension = {
          tenantCode: extTenantCode,
          number: extension[0].number
        };
      }

      const { number, tenantCode } = context.params.user.myExtension;
      if(number == mailboxuser && tenantCode == mailboxContext){
        return context;
      } else{
        throw new Forbidden('You cannot fetch this record!');
      }
    }

    //if user role is 3 we only want to allow the tenants they are authorized for. if they request a get on unauthorized tenant id throw error
    if(+userRole !== 1){
      if(!tenantIds.includes(+tenantId)){
        throw new Forbidden('Not Authorized. You Do Not Have Permission to Access This Record');
      }
    }

    return context;
  };
};
