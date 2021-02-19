const { BadRequest, Forbidden } = require('@feathersjs/errors');
const fs = require('fs');

module.exports = async (data, params, app) => {

  const {myExtension, email} = params.user;

  //gather information about the files.
  let fileNames = '';
  let validFiles = [];
  let invalidFiles = [];
  for(let i = 0; i < params.files.length; i++){
    if(params.files[i].mimetype === 'application/pdf'){
      fileNames += params.files[i].path + ' ';
      validFiles.push(params.files[i].path);
    }else {
      invalidFiles.push(params.files[i].path);
    }
  }

  //remove files from tmp that cannot be faxed (not PDF)
  for(let i = 0; i < invalidFiles.length; i++){
    fs.unlink(invalidFiles[i], (err) => {});
  }

  //check that the omnia user actually has extension assigned
  if(!myExtension){

    const mailToFax = await app.service('mail-to-faxes')._find({
      paginate: false,
      query: {
        email
      }
    });
    if(!mailToFax.length){
      for(let i = 0; i < validFiles.length; i++){
        fs.unlink(validFiles[i], (err) => {});
      }
      throw new Forbidden('You are not configured for mail to fax!');
    }

    params.user.faxNumber = mailToFax[0].cidnum;
    const mfTenant = await app.service('tenants')._get(mailToFax[0].tenantId);
    params.user.myExtension = {
      tenantCode: mfTenant.tenantCode,
      name: mailToFax[0].name,
      tenantId: mailToFax[0].tenantId
    };
  }

  //simply parse the post data to get To, From, Cover Page Message, Files
  const { message, numberTo } = data;
  const { faxNumber } = params.user;
  const { tenantCode, tenantId, name } = params.user.myExtension;

  return {
    tenantCode,
    tenantId,
    faxFromName: name,
    faxFrom: faxNumber,
    faxTo: numberTo,
    statusEmail: email,
    coverMessage: message,
    files: fileNames
  };

};
