const {Forbidden, BadRequest} = require('@feathersjs/errors');

//Check To Make Sure the User is Allowed to Fetch This Record
exports.checkGetAuth = function () {
  return async context => {

    const {tenantId} = context.result;
    const {userRole, tenantIds} = context.params.user;

    if (+userRole !== 1) {
      if (!tenantIds.includes(tenantId)) {
        throw new Forbidden('Not Authorized. You Do Not Have Permission to Access This Record');
      }
    }

    return context;
  };
};

//API Key Check For Requests without JWT/User
exports.checkNoAuthKey = function () {
  return async context => {

    const { noAuth } = context.params.query;

    if (!noAuth) {
      throw new Forbidden('Auth Key Not Provided');
    }

    const settingsService = context.app.service('tenant-settings');
    const settings = await settingsService._find({
      query: {
        code: 'NOAUTHKEY'
      }
    });

    const key = settings[0].value;

    if (key === noAuth) {
      return context;
    }

    throw new Forbidden('Invalid Key. Not Authorized.');

  };
};

//Check Requesting User To Be Sure They Can Access Requested Queue Info
exports.checkQueueAuth = function () {
  return async context => {

    const {userRole, tenantIds, email, myExtension} = context.params.user;
    const userId = context.params.user.id;
    const {queueId} = context.params.query;

    if (+userRole === 1) {
      return context;
    }

    if (+userRole === 5 || +userRole === 7) {

      //just in case the query comes from a user and myextension is not attached. we will verify.
      if (!myExtension) {
        const extension = await context.app.service('extensions').find({
          query: {
            email
          }
        });

        if(extension.length){
          context.params.user.myExtension = {
            peerName: extension[0].peerName
          };
        }
      }

      if (context.params.user.myExtension) {

        const {peerName} = context.params.user.myExtension;

        //if user role 7 we can check the pivots first and return and get outta here.
        if(+userRole === 7){
          const adminQueues = await context.app.service('queue-managers')._find({
            query: {
              queueId,
              userId
            }
          });
          if(adminQueues.length){
            return context;
          }
        }

        const members = await context.app.service('queuemembers')._find({
          query: {
            memberdevice: peerName,
            queueName: queueId
          }
        });

        if(members.length){
          return context;
        }

        const allowedMembers = await context.app.service('queuemembers-allowed')._find({
          query: {
            memberdevice: peerName,
            queueName: queueId
          }
        });

        if(allowedMembers.length){
          return context;
        }

        throw new Forbidden('You Are Not Authorized to View This Queue');

      } else {
        throw new BadRequest('Your User Does Not Have An Assigned Extension. ');
      }
    }

    //roles 5 and 7 can't make it here.
    //if admin role, query the queue tenant and make sure they have access to the tenant.
    const queues = await context.app.service('queues').find({
      query: {
        tenantId: {$in: tenantIds}
      }
    });
    const queueIds = queues.map( queue => queue.id);

    if (!queueIds.length) {
      throw new Forbidden('You Do Not Have access to This Queue!');
    }

    const queueParam = JSON.parse(queueId);
    if (Array.isArray(queueParam)) {
      for (let i = 0; i < queueParam.length; i++) {
        if (!queueIds.includes(+queueParam[i])) {
          throw new Forbidden('You Do No Have Access to this Queue! ID:' + queueParam[i]);
        }
      }
    }

    if (!queueIds.includes(+queueId)) {
      throw new Forbidden('You Do No Have Access to this Queue!');
    }

    return context;
  };
};

//Check For The Queue Id In Request Query Params
exports.checkQueueId = function () {

  return async context => {

    const {queueId} = context.params.query;

    if (!queueId) {
      throw new BadRequest('You Must Provide a Queue ID!');
    }

    return context;
  };

};

//Check For the Tenant Id In Request Query Params
exports.checkTenantId = function () {
  return async context => {

    const { userRole } = context.params.user;
    const { tenantId } = context.params.query;

    if (+userRole === 1) {
      return context;
    }

    if(!tenantId){
      throw new BadRequest('You Must Provide a Tenant Account ID!');
    }

    return context;
  };
};

//Check If Request is Non-JWT and We Need To Check the No Auth API Key
exports.isNoAuthRequest = function () {

  return context => {
    return !!(context.params.query && context.params.query.noAuth);
  };

};

//Converts Integer User Role To String For Handling with Feathers Permissions
exports.roleToString = function () {

  return async context => {
    const {userRole} = context.params.user;
    context.params.user.userRole = userRole.toString();
    return context;
  };

};

//Verify User Can Access Tenants For The Given Request
exports.verifyTenants = function () {

  return async context => {
    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const {userRole, tenantId, tenantIds} = context.params.user;
    const {query} = context.params;

    if (+userRole === 5 || +userRole === 7) {
      if (+tenantId === +query.tenantId) {
        return context;
      } else {
        throw new Forbidden('You Do Not Have Permission To Access This Record');
      }
    }

    //if user role is 3 we only want to allow the tenants they are authorized for. so we will force query params regardless of their query
    if (+userRole !== 1) {

      const idsInit = JSON.parse(query.tenantId);

      let authIds = [];
      if (Array.isArray(idsInit)) {
        authIds = idsInit.filter( (id) => tenantIds.includes(id));
      } else {
        authIds = tenantIds.includes(idsInit) ? [idsInit] : authIds;
      }

      if (!authIds.length) {
        throw new Forbidden('Not Authorized. You Do Not Have Permission to Access Records For This Tenant!');
      }

      context.params.query.tenantId = authIds;
    }

    return context;
  };

};




