const groupBy = require('lodash/groupBy');

module.exports = async (params, app) => {

  const emailRes = await app.service('extensions')._find({
    query: {
      tenantId: params.tenantId,
      number: {$in: params.numbers},
      $select: ['number', 'email', 'name']
    }
  })

  //this provides a valid extension number array and an email reference object
  let extNumArray = [];
  let emailRef = [];
  let agentNamesArray = [];
  let extNameKey = {};
  const resLength = emailRes.length;
  for( let i=0; i<resLength; i++){
    extNumArray.push(emailRes[i].number.toString());
    agentNamesArray.push('' + emailRes[i].name.split(' ').join('_') + '');
    extNameKey[emailRes[i].name.split(' ').join('_')] = emailRes[i].number;

    if(emailRes[i].email !== null){
      if(emailRes[i].email.length > 2){
        emailRef.push(emailRes[i]);
      }
    }
  }
  //key email object by extension number
  emailRef = groupBy(emailRef, 'number');

  return {
    emailRef,
    extNumArray,
    agentNamesArray,
    extNameKey
  };

};
