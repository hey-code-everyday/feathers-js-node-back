const didDefaults = require('../../dids/validation/defaults');

module.exports = async (data, params, app) => {

  const {tnItem} = data.tnList;

  let insertDids = [];

  for(let i = 0; i<tnItem.length; i++){
    let didObject = {
      tenantId: params.tenantId,
      number: tnItem[i].tn,
      diCommentName: params.tenantName
    };
    Object.assign(didObject, didDefaults.DID);
    insertDids.push(didObject);
  }

  //create all the dids here.
  await app.service('dids').create(insertDids);

};
