const {BadRequest} = require('@feathersjs/errors');

exports.checkForExtension = () => {
  return async context => {

    const {myExtension, email} = context.params.user;

    //if myExtension is not attached we need to double check for it
    if(!myExtension){

      const extensions = await context.app.service('extensions')._find({
        paginate: false,
        query: {
          email
        }
      });

      if(extensions.length){
        context.params.user.myExtension = {
          number: extensions[0].number
        };
      }
    }

    if(!context.params.user.myExtension){
      throw new BadRequest('Your User Has No Extension Number');
    }

    if(!context.params.user.myExtension.number){
      throw new BadRequest('Your User Has No Extension Number');
    }

    return context;
  };
};
