const {Forbidden} = require('@feathersjs/errors');

exports.filterToExtension = function () {
  return async context => {

    const {userRole, myExtension, email} = context.params.user;

    //in this situation we want to force only this user extensions cdrs
    if(+userRole === 5 || +userRole === 7){

      if(!myExtension){
        const extension = await context.app.service('extensions')._find({
          paginate: false,
          query: {
            email
          }
        });
        if(extension.length){
          context.params.user.myExtension = {
            number: extension[0].number
          };
        }
      }

      if(!context.params.user.myExtension){
        throw new Forbidden('All Your Calls Are Belong To Us! Your role requires your user email to be tied to your extension');
      }

      const {number} = context.params.user.myExtension;

      context.params.query = {
        ...context.params.query,
        $or: [
          { wherelanded: number},
          { lastdst: number},
          { lastdst: `Voicemail ${number}`}
        ]
      };
    }

    return context;
  };
};
