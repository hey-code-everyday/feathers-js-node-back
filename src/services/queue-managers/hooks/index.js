const { Forbidden } = require('@feathersjs/errors');

exports.verifyQueueId = function () {
  return async context => {

    const {tenantIds, userRole} = context.params.user;
    const { queueId } = context.params.query;

    if(+userRole !== 1){
      const {tenantId} = await context.app.service('queues')._get(queueId);
      if(!tenantIds.includes(tenantId)){
        throw new Forbidden('You Are Not Authorized to View This Queue');
      }
    }

    return context;

  };
};
