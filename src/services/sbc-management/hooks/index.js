const permissions = require('../permissions');
const { Forbidden } = require ('@feathersjs/errors');

exports.kamPermissions = function () {
  return async context => {

    const { userRole } = context.params.user;
    const { command } = context.data;

    if(!permissions[command].includes(userRole)){
      throw new Forbidden('You do not have permission to make this request!');
    }

    return context;

  };
};
