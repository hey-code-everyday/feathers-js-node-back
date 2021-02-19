exports.resolverGet = {
  joins: {
    voicemail: () => async (message, context) => {
      const voicemails = await context.app.service('voicemails')._find({paginate: false, query: {mailbox: message.mailboxuser, context: message.mailboxContext}});
      if(voicemails.length){
        message.voicemail = voicemails[0];
        message.tenantId = voicemails[0].tenantId;
      }
    }
  }
};
