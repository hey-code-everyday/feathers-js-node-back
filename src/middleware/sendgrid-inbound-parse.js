const inboundParse = require('@sendgrid/inbound-mail-parser');

module.exports = function (req) {

  const config = {
    keys: ['to', 'from', 'subject', 'text', 'attachments']
  };
  const parsedMail = new inboundParse(config, req);
  const emailFields = parsedMail.keyValues();

  return {
    ...emailFields
  };

};
