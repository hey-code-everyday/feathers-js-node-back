const deRef = require('../../../ref/destinations-reference');

exports.resolverGet = {
  joins: {
    destinations: () => async (voicemail, context) => {
      voicemail.de_destinations = await context.app.service('destinations').find(
        {
          paginate: false,
          query: {tenantId: voicemail.tenantId, de_type_src: deRef.VOICEMAIL, typeIdSrc: voicemail.id }
        }
      );
    },
    messages: () => async (voicemail, context) => {
      const messages = await context.app.service('voicemail-messages').find({
        paginate: false,
        query: {
          mailboxuser: voicemail.mailbox,
          mailboxContext: voicemail.context,
          msgId: {$ne: ''},
          $select: ['id', 'dir', 'origTime', 'callerId', 'duration', 'mailboxuser', 'mailboxContext', 'msgId', 'msgnum'],
          $sort: {
            origTime: -1
          }
        }
      });
      for(let i = 0; i<messages.length; i++){
        const dirSplit = messages[i]['dir'].split(`${messages[i]['mailboxContext']}/`)[1];
        const readStatus = dirSplit.split('/')[1] == 'INBOX' ? 'unread' : 'read';
        messages[i].status = readStatus;
      }
      voicemail.messages = messages;
    }
  }
};
