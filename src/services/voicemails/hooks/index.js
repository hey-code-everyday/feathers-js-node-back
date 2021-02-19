const { Forbidden } = require('@feathersjs/errors');

exports.voicemailGetAuth = function () {
  return async (context) => {
    const { tenantId } = context.result;

    //we have access to the user making the request, so we can check the role id and customize the query accordingly.
    const { userRole, myExtension, email, tenantIds } = context.params.user;

    if (+userRole === 5 || +userRole === 7) {
      if (!myExtension) {
        const extension = await context.app.service('extensions')._find({
          paginate: false,
          query: {
            email,
          },
        });
        if (!extension.length) {
          throw new Forbidden('You cannot fetch this record!');
        }

        const voicemail = await context.app.service('voicemails')._find({
          paginate: false,
          query: {
            mailbox: extension[0].number,
            tenantId: extension[0].tenantId,
          },
        });

        if (voicemail.length) {
          context.params.user.myExtension = {
            voicemailId: voicemail[0].id,
          };
        }
      }

      const { voicemailId } = context.params.user.myExtension;
      if (context.id == voicemailId) {
        return context;
      } else {
        throw new Forbidden('You cannot fetch this record!');
      }
    }

    //if user role is 3 we only want to allow the tenants they are authorized for. if they request a get on unauthorized tenant id throw error
    if (+userRole !== 1) {
      if (!tenantIds.includes(+tenantId)) {
        throw new Forbidden(
          'Not Authorized. You Do Not Have Permission to Access This Record'
        );
      }
    }

    return context;
  };
};
